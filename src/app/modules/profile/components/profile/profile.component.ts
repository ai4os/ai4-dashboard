import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import {
    catchError,
    distinctUntilChanged,
    finalize,
    forkJoin,
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
import { ProfileService } from '../../services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SecretsService } from '../../../deployments/services/secrets-service/secrets.service';
import { urlValidator } from '@app/modules/catalog/components/train/general-conf-form/general-conf-form.component';
import { StorageService } from '@app/modules/catalog/services/storage-service/storage.service';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

export interface VoInfo {
    name: string;
    roles: string[];
}

export interface MLflowCredentials {
    username: string;
    password: {
        value: string;
        hide: boolean;
    };
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
        private secretsService: SecretsService,
        private storageService: StorageService,
        private appConfigService: AppConfigService,
        public confirmationDialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private snackbarService: SnackbarService,
        private fb: FormBuilder
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    protected isLoginLoading = false;
    protected isStorageLoading = false;
    protected isHfTokenLoading = false;
    protected isOtherLoading = false;

    private stopPolling$ = timer(300000);
    private loginResponse: RequestLoginResponse = {
        poll: {
            token: '',
            endpoint: '',
        },
        login: '',
    };

    protected sub = '';
    protected roles: string[] = [];
    name = '';
    email = '';
    isAuthorized = false;

    protected vos: VoInfo[] = [];
    protected ai4osEndpoint = 'share.cloud.ai4eosc.eu';
    protected customEndpoint = '';
    customEndpointFormGroup = this.fb.group({
        value: ['', [Validators.required, domainValidator()]],
    });

    protected serviceCredentials: StorageCredential[] = [];
    protected customServiceCredentials: StorageCredential[] = [];

    storageConfFormGroup = this.fb.group({
        rcloneConfInput: ['/srv/.rclone/rclone.conf'],
        storageUrlInput: ['', [urlValidator()]],
        rcloneVendorSelect: ['nextcloud', Validators.required],
        rcloneUserInput: ['', Validators.required],
        rclonePasswordInput: ['', Validators.required],
    });

    protected hideRclonePassword = true;
    protected rcloneVendorOptions: { value: string; viewValue: string }[] = [
        { value: 'nextcloud', viewValue: 'nextcloud' },
    ];

    protected mlflowCredentials: MLflowCredentials = {
        username: '',
        password: {
            value: '',
            hide: true,
        },
    };

    protected hfToken = {
        value: '',
        hide: true,
    };

    ngOnInit(): void {
        this.authService.isDoneLoading$.subscribe((done) => {
            if (done) {
                this.authService.loadUserProfile();
            }
        });

        this.authService.userProfileSubject
            .pipe(
                distinctUntilChanged(
                    (prev, curr) =>
                        JSON.stringify(prev) === JSON.stringify(curr)
                )
            )
            .subscribe((profile) => {
                if (profile) {
                    this.name = profile.name;
                    this.email = profile.email;
                    this.sub = profile.sub;
                    this.isAuthorized = profile.isAuthorized;

                    if (profile.roles) {
                        this.getVoInfo(profile.roles);
                    }

                    if (this.isAuthorized) {
                        this.getExistingRcloneCredentials();
                        this.getOtherServicesCredentials();
                    }
                }
            });
    }

    getVoInfo(roles: string[]) {
        roles.forEach((role) => {
            const match = role.match(
                /^access:([^:]+):(ap-a|ap-a1|ap-b|ap-u|ap-d)$/
            );

            if (match) {
                const voName = match[1]; // e.g. "vo.ai4eosc.eu"
                const accessType = match[2]; // "ap-u", "ap-b", "ap-a", etc
                const index = this.vos.findIndex((v) => v.name === voName);
                if (index === -1) {
                    this.vos.push({ name: voName, roles: [accessType] });
                } else {
                    if (!this.vos[index].roles.includes(accessType)) {
                        this.vos[index].roles.push(accessType);
                    }
                }
            }
        });
    }

    getExistingRcloneCredentials() {
        this.isStorageLoading = true;
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
                    (c) => c.server !== 'share.cloud.ai4eosc.eu'
                );

                // TODO: remove this section after a grace period
                if (
                    this.customServiceCredentials.find(
                        (c: StorageCredential) =>
                            c.server === 'share.services.ai4os.eu'
                    )
                ) {
                    this.customServiceCredentials =
                        this.serviceCredentials.filter(
                            (c) => c.server !== 'share.services.ai4os.eu'
                        );
                    this.secretsService
                        .deleteSecret(
                            '/services/storage/share.services.ai4os.eu'
                        )
                        .subscribe();
                }

                this.isStorageLoading = false;
            },
            error: () => {
                this.isStorageLoading = false;
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
                        this.isLoginLoading = false;
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
                    this.isStorageLoading = true;
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

    saveRcloneCredentials(serviceName: string) {
        this.isStorageLoading = true;
        const secret: StorageCredential = {
            loginName:
                this.storageConfFormGroup.get('rcloneUserInput')?.value ?? '',
            appPassword:
                this.storageConfFormGroup.get('rclonePasswordInput')?.value ??
                '',
            conf: this.storageConfFormGroup.get('rcloneConfInput')?.value ?? '',
            server:
                this.storageConfFormGroup.get('storageUrlInput')?.value ?? '',
            vendor:
                this.storageConfFormGroup.get('rcloneVendorSelect')?.value ??
                '',
        };
        serviceName = serviceName.replace(/^https?:\/\//, '');
        const secretPath = '/services/storage/' + serviceName;
        this.secretsService.createSecret(secret, secretPath).subscribe({
            next: () => {
                this.storageService.getStorageFiles(serviceName).subscribe({
                    next: () => {
                        this.getExistingRcloneCredentials();
                        this.storageConfFormGroup
                            .get('rcloneUserInput')
                            ?.reset();
                        this.storageConfFormGroup
                            .get('rclonePasswordInput')
                            ?.reset();
                        this.storageConfFormGroup
                            .get('storageUrlInput')
                            ?.reset();
                        this.snackbarService.openSuccess(
                            'Successfully added ' + serviceName + ' credentials'
                        );
                    },
                    error: () => {
                        this.secretsService.deleteSecret(secretPath).subscribe({
                            next: () => {
                                this.isStorageLoading = false;
                            },
                            error: () => {
                                this.isStorageLoading = false;
                                this.snackbarService.openError(
                                    'Error deleting ' +
                                        serviceName +
                                        ' credentials'
                                );
                            },
                        });
                        this.isStorageLoading = false;
                        this.snackbarService.openError(
                            'New storage could not be validated.'
                        );
                    },
                });
            },
            error: () => {
                this.isStorageLoading = false;
                this.snackbarService.openError(
                    'Error storing your RCLONE credentials.'
                );
            },
        });
    }

    openCustomNextcloudDocumentationWeb(): void {
        const url =
            'https://docs.ai4os.eu/en/latest/technical/howto-developers/storage-providers.html#nextcloud';
        window.open(url);
    }

    openProfileInfo(): void {
        const url = 'https://login.cloud.ai4eosc.eu/realms/ai4eosc/account/';
        window.open(url);
    }

    getOtherServicesCredentials() {
        this.isOtherLoading = true;

        const mlflow$ = this.secretsService.getSecrets('/services/mlflow');
        const hf$ = this.secretsService.getSecrets('/services/huggingface');

        forkJoin([mlflow$, hf$]).subscribe({
            next: ([mlflowTokens, hfTokens]) => {
                // MLflow
                const mlflowSecrets = Object.values(mlflowTokens);
                if (mlflowSecrets.length > 0) {
                    this.mlflowCredentials.username =
                        mlflowSecrets[0].username ?? '';
                    this.mlflowCredentials.password.value =
                        mlflowSecrets[0].password ?? '';
                }

                // Hugging Face
                const hfSecrets = Object.values(hfTokens);
                if (hfSecrets.length > 0) {
                    this.hfToken.value = hfSecrets[0].token ?? '';
                }
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve credentials. Please try again later."
                );
            },
            complete: () => {
                this.isOtherLoading = false;
            },
        });
    }

    startLoginWithHuggingFace() {
        this.profileService.loginWithHuggingFace();
    }

    unsyncHuggingFace() {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to revoke your Hugging Face token?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.isHfTokenLoading = true;
                    this.secretsService
                        .deleteSecret('/services/huggingface/token')
                        .subscribe({
                            next: () => {
                                this.hfToken.value = '';
                                localStorage.removeItem('hf_access_token');
                                this.isHfTokenLoading = false;
                                this.snackbarService.openSuccess(
                                    'Successfully deleted Hugging Face token'
                                );
                            },
                            error: () => {
                                this.isHfTokenLoading = false;
                                this.snackbarService.openError(
                                    'Error deleting Hugging Face token'
                                );
                            },
                        });
                }
            });
    }

    syncMlflow() {
        let url = '';
        if (this.appConfigService.projectName === 'iMagine') {
            url = 'https://mlflow.cloud.imagine-ai.eu/signup';
        } else {
            url = 'https://mlflow.cloud.ai4eosc.eu/signup';
        }
        window.open(url);
    }
}
