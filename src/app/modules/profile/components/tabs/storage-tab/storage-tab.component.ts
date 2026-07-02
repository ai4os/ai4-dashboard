import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    AbstractControl,
    FormBuilder,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {
    catchError,
    finalize,
    interval,
    of,
    switchMap,
    takeUntil,
    takeWhile,
    timer,
} from 'rxjs';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogData,
} from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { ProfileService } from '@app/modules/profile/services/profile-service/profile.service';
import { SecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service';
import { StorageService } from '@app/modules/catalog/services/storage-service/storage.service';
import { urlValidator } from '@app/modules/catalog/components/train/general-conf-form/general-conf-form.component';
import {
    RequestLoginResponse,
    StorageCredential,
} from '@app/shared/interfaces/profile.interface';
import { StorageProvidersStore } from '@app/modules/profile/store/storage-providers.store';

export function domainValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const regex = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/i;
        let value = control.value as string;
        if (!value || typeof value !== 'string') return null;
        value = value.replace(/^(https?:\/\/)/, '').split(/[/\s]/)[0];
        return regex.test(value) ? null : { invalidDomain: true };
    };
}

@Component({
    selector: 'app-storage-tab',
    templateUrl: './storage-tab.component.html',
    styleUrl: './storage-tab.component.scss',
})
export class StorageTabComponent implements OnInit {
    @Input() isProjectMember = false;

    store = inject(StorageProvidersStore);
    private profileService = inject(ProfileService);
    private secretsService = inject(SecretsService);
    private storageService = inject(StorageService);
    private snackbarService = inject(SnackbarService);
    private confirmationDialog = inject(MatDialog);
    private fb = inject(FormBuilder);

    syncingId = signal<string | null>(null);
    hideRclonePassword = signal(true);
    advancedExpanded = false;

    readonly rcloneVendorOptions = [
        { value: 'nextcloud', viewValue: 'Nextcloud' },
    ];

    // Simple method: domain
    customEndpointForm = this.fb.group({
        domain: ['', [Validators.required, domainValidator()]],
    });

    // Advanced method: manual rclone
    storageConfForm = this.fb.group({
        rcloneUser: ['', Validators.required],
        rclonePassword: ['', Validators.required],
        rcloneConf: ['/srv/.rclone/rclone.conf'],
        storageUrl: ['', [urlValidator()]],
        vendor: ['nextcloud', Validators.required],
    });

    private stopPolling$ = timer(300000);
    private loginResponse: RequestLoginResponse = {
        poll: { token: '', endpoint: '' },
        login: '',
    };

    ngOnInit(): void {
        if (!this.isProjectMember) return;
        this.store.ensureLoaded();
    }

    onRelink(domain: string): void {
        this.syncRclone(domain);
    }

    onRemove(domain: string): void {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: {
                    title: 'PROFILE.STORAGE-TAB.DIALOG.TITLE',
                    subtitlePrefix:
                        'PROFILE.STORAGE-TAB.DIALOG.SUBTITLE-PREFIX',
                    subtitleHighlight: domain,
                    subtitleSuffix:
                        'PROFILE.STORAGE-TAB.DIALOG.SUBTITLE-SUFFIX',
                    optionA: 'GENERAL.CANCEL',
                    optionB: 'PROFILE.ACTIONS.DISCONNECT',
                } as ConfirmationDialogData,
                panelClass: 'ui-dialog-panel',
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (!confirmed) return;
                this.profileService.deleteCredential(domain).subscribe({
                    next: () => {
                        this.store.forceReload();
                        this.snackbarService.openSuccess(
                            'Successfully deleted ' + domain + ' credentials'
                        );
                    },
                    error: () => {
                        this.snackbarService.openError(
                            'Error deleting ' + domain + ' credentials'
                        );
                    },
                });
            });
    }

    onAddByDomain(domain?: string): void {
        if (!domain) {
            domain = this.customEndpointForm.get('domain')?.value ?? '';
            if (!this.customEndpointForm.valid || !domain) return;
            this.customEndpointForm.reset();
        }

        this.syncRclone(domain);
    }

    onAddManually(): void {
        if (!this.storageConfForm.valid) return;

        const v = this.storageConfForm.value;
        const server = (v.storageUrl ?? '').replace(/^https?:\/\//, '');
        const secret: StorageCredential = {
            loginName: v.rcloneUser ?? '',
            appPassword: v.rclonePassword ?? '',
            conf: v.rcloneConf ?? '',
            server,
            vendor: v.vendor ?? 'nextcloud',
        };
        const secretPath = '/services/storage/' + server;

        this.secretsService.createSecret(secret, secretPath).subscribe({
            next: () => {
                this.storageService.getStorageFiles(server).subscribe({
                    next: () => {
                        this.store.forceReload();
                        this.storageConfForm.reset({
                            rcloneConf: '/srv/.rclone/rclone.conf',
                            vendor: 'nextcloud',
                        });
                        this.snackbarService.openSuccess(
                            'Successfully added ' + server + ' credentials'
                        );
                    },
                    error: () => {
                        this.secretsService
                            .deleteSecret(secretPath)
                            .subscribe();
                        this.snackbarService.openError(
                            'New storage could not be validated.'
                        );
                    },
                });
            },
            error: () => {
                this.snackbarService.openError(
                    'Error storing your RCLONE credentials.'
                );
            },
        });
    }

    private syncRclone(domain: string): void {
        const serviceName = domain
            .replace(/^(https?:\/\/)/, '')
            .split(/[/\s]/)[0];
        this.syncingId.set(serviceName);

        this.profileService.initLogin(serviceName).subscribe({
            next: (response) => {
                this.loginResponse = response;
                window.open(response.login, '_blank');
                this.pollRcloneCredentials(serviceName);
            },
            error: () => {
                this.syncingId.set(null);
                this.snackbarService.openError(
                    'Error syncronizing your account. Check you are using a valid domain.'
                );
            },
        });
    }

    private pollRcloneCredentials(serviceName: string): void {
        let syncCompleted = false;

        interval(2000)
            .pipe(
                switchMap(() =>
                    this.profileService
                        .getNewCredentials(this.loginResponse)
                        .pipe(catchError((error) => of(error)))
                ),
                takeUntil(this.stopPolling$),
                takeWhile((response) => {
                    if (response.status === 200) {
                        syncCompleted = true;
                        return false;
                    }
                    return true;
                }, true),
                finalize(() => {
                    this.syncingId.set(null);
                    if (syncCompleted) {
                        this.snackbarService.openSuccess(
                            'The login process was successfully completed'
                        );
                    } else {
                        this.snackbarService.openError(
                            'The login process could not be completed. Try again.'
                        );
                    }
                })
            )
            .subscribe({
                next: (response) => {
                    if (response.status === 200) {
                        const credential = response.body;
                        credential.vendor = 'nextcloud';
                        this.profileService
                            .addCredential(credential, serviceName)
                            .subscribe({
                                next: () => {
                                    this.store.forceReload();
                                    this.snackbarService.openSuccess(
                                        'Successfully generated ' +
                                            serviceName +
                                            ' credentials'
                                    );
                                },
                                error: () => {
                                    this.snackbarService.openError(
                                        'Error generating ' +
                                            serviceName +
                                            ' credentials'
                                    );
                                },
                            });
                    }
                },
            });
    }
}
