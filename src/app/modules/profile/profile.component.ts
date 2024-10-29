import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
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
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    AbstractControl,
    FormBuilder,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {
    RequestLoginResponse,
    StorageCredential,
} from '@app/shared/interfaces/profile.interface';
import { ProfileService } from './services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';

export interface VoInfo {
    name: string;
    roles: string[];
}

export function domainValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const regexPattern =
            /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/i;

        let value = control.value as string;

        if (!value || typeof value !== 'string') {
            return null;
        }

        value = value.replace(/^(https?:\/\/)/, '');
        value = value.split(/[/\s]/)[0];

        const valid = regexPattern.test(value);
        return valid ? null : { invalidDomain: true };
    };
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    constructor(
        private readonly authService: AuthService,
        private profileService: ProfileService,
        public confirmationDialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private snackbarService: SnackbarService,
        private fb: FormBuilder
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
        authService.loadUserProfile();
    }

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    protected isLoading = true;
    protected isLoginLoading = false;

    private stopPolling$ = timer(300000);
    private loginResponse: RequestLoginResponse = {
        poll: {
            token: '',
            endpoint: '',
        },
        login: '',
    };

    protected name = '';
    protected email = '';
    protected isAuthorized = false;
    protected vos: VoInfo[] = [];
    protected ai4osEndpoint = 'share.services.ai4os.eu';
    protected customEndpoint = '';
    customEndpointFormGroup = this.fb.group({
        value: ['', [Validators.required, domainValidator()]],
    });

    protected serviceCredentials: StorageCredential[] = [];
    protected customServiceCredentials: StorageCredential[] = [];

    ngOnInit(): void {
        this.authService.userProfileSubject.subscribe((profile) => {
            this.name = profile.name;
            this.email = profile.email;
            this.isAuthorized = profile.isAuthorized;

            if (profile.eduperson_entitlement) {
                this.getVoInfo(profile.eduperson_entitlement);
            }

            if (this.isAuthorized) {
                this.getExistingRcloneCredentials();
            } else {
                this.isLoading = false;
            }
        });
    }

    getVoInfo(eduperson_entitlement: string[]) {
        this.vos = [];
        eduperson_entitlement.forEach((e) => {
            const voMatch = e.match(/vo\.[^:]+/);
            const roleMatch = e.match(/role=([^#]+)/);

            let voName = voMatch ? voMatch[0] : '';
            voName = voName.substring(3);
            voName = voName.substring(0, voName.length - 3);
            const role = roleMatch ? roleMatch[1] : '';

            const index = this.vos.findIndex((v) => v.name === voName);
            if (index !== -1) {
                this.vos[index].roles.push(role);
            } else {
                const newVo = { name: voName, roles: [role] };
                this.vos.push(newVo);
            }
        });
    }

    getExistingRcloneCredentials() {
        this.profileService.getExistingCredentials().subscribe({
            next: (credentials) => {
                this.serviceCredentials = [];
                this.customServiceCredentials = [];
                for (let i = 0; i < Object.values(credentials).length; i++) {
                    const credential: StorageCredential = {
                        vendor: Object.values(credentials)[i].vendor,
                        server: Object.keys(credentials)[i].substring(
                            Object.keys(credentials)[i].lastIndexOf('/') + 1
                        ),
                        loginName: Object.values(credentials)[i].loginName,
                        appPassword: Object.values(credentials)[i].appPassword,
                    };
                    this.serviceCredentials.push(credential);
                }
                this.customServiceCredentials = this.serviceCredentials.filter(
                    (c) => c.server !== 'share.services.ai4os.eu'
                );
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            },
        });
    }

    credentialsExist(serverName: string): boolean {
        const credential = this.serviceCredentials.find(
            (c) => c.server === serverName
        );
        return credential ? true : false;
    }

    syncRclone(serviceName: string) {
        this.isLoading = true;
        this.isLoginLoading = true;
        serviceName = serviceName.replace(/^(https?:\/\/)/, '');
        serviceName = serviceName.split(/[/\s]/)[0];
        this.profileService.initLogin(serviceName).subscribe({
            next: (response) => {
                this.loginResponse = response;
                window.open(response.login, '_blank');
                this.pollRcloneCredentials(serviceName);
            },
            error: () => {
                this.isLoading = false;
                this.isLoginLoading = false;
                this.snackbarService.openError(
                    'Error syncronizing your account. Check you are using a valid domain.'
                );
            },
        });
    }

    pollRcloneCredentials(serviceName: string) {
        let syncCompleted = false;

        interval(2000) // Intervalo de 2 segundos
            .pipe(
                switchMap(() =>
                    this.profileService
                        .getNewCredentials(this.loginResponse)
                        .pipe(
                            catchError((error) => {
                                return of(error);
                            })
                        )
                ),
                takeUntil(this.stopPolling$),
                takeWhile((response) => {
                    if (response.status === 200) {
                        syncCompleted = true;
                        return false; // stop polling
                    } else {
                        syncCompleted = false;
                        return true; // continue polling
                    }
                }, true),
                finalize(() => {
                    this.isLoginLoading = false;
                    if (syncCompleted) {
                        this.snackbarService.openSuccess(
                            'The login process was successfully completed'
                        );
                    } else {
                        this.isLoading = false;
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
                                    this.isLoginLoading = false;
                                    this.customEndpointFormGroup
                                        .get('value')
                                        ?.setValue('');
                                    this.customEndpointFormGroup.markAsUntouched();
                                    this.getExistingRcloneCredentials();
                                    this.snackbarService.openSuccess(
                                        'Successfully generated ' +
                                            serviceName +
                                            ' credentials'
                                    );
                                },
                                error: () => {
                                    this.isLoading = false;
                                    this.isLoginLoading = false;
                                    this.snackbarService.openError(
                                        'Error generating ' +
                                            serviceName +
                                            ' credentials'
                                    );
                                },
                            });
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.isLoginLoading = false;
                },
            });
    }

    unsyncRclone(serviceName: string) {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to revoke these credentials?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.isLoading = true;
                    serviceName = serviceName.replace(/^(https?:\/\/)/, '');
                    serviceName = serviceName.split(/[/\s]/)[0];
                    this.profileService
                        .deleteCredential(serviceName)
                        .subscribe({
                            next: () => {
                                this.getExistingRcloneCredentials();
                                this.snackbarService.openSuccess(
                                    'Successfully deleted ' +
                                        serviceName +
                                        ' credentials'
                                );
                            },
                            error: () => {
                                this.isLoading = false;
                                this.isLoginLoading = false;
                                this.snackbarService.openError(
                                    'Error deleting ' +
                                        serviceName +
                                        ' credentials'
                                );
                            },
                        });
                }
            });
    }

    resyncRclone(serviceName: string) {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to resynchronize these credentials?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.syncRclone(serviceName);
                }
            });
    }

    openCustomNextcloudDocumentationWeb(): void {
        const url =
            'https://docs.ai4eosc.eu/en/latest/technical/howto-developers/storage-providers.html#nextcloud';
        window.open(url);
    }
}
