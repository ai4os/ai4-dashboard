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
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';
import {
    RequestLoginResponse,
    StorageCredential,
} from '@app/shared/interfaces/profile.interface';
import { ProfileService } from './services/profile.service';

export interface VoInfo {
    name: string;
    roles: string[];
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
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private _snackBar: MatSnackBar,
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

    private stopPolling$ = timer(20000);
    private loginResponse: RequestLoginResponse = {
        poll: {
            token: '',
            endpoint: '',
        },
        login: '',
    };

    protected name = '';
    protected email = '';
    protected vos: VoInfo[] = [];
    protected ai4osEndpoint = 'share.services.ai4os.eu';
    protected customEndpoint = '';
    customEndpointFormGroup = this.fb.group({
        value: ['', [Validators.required]],
    });

    protected serviceCredentials: StorageCredential[] = [];

    ngOnInit(): void {
        this.authService.userProfileSubject.subscribe((profile) => {
            this.name = profile.name;
            this.email = profile.email;
            this.getVoInfo(profile.eduperson_entitlement);
        });
        this.getExistingRcloneCredentials();
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
        this.profileService.initLogin(serviceName).subscribe({
            next: (response) => {
                this.loginResponse = response;
                window.open(response.login, '_blank');
                this.pollRcloneCredentials(serviceName);
            },
            error: () => {
                this.isLoading = false;
                this.isLoginLoading = false;
                this._snackBar.open(
                    'Error syncronizing your account. Check you are using the correct domain.',
                    'X',
                    {
                        duration: 3000,
                        panelClass: ['red-snackbar'],
                    }
                );
            },
        });
    }

    pollRcloneCredentials(serviceName: string) {
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
                takeWhile((response) => response.status !== 200, true),
                finalize(() => {
                    this.isLoading = false;
                    this.isLoginLoading = false;
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
                                    this.isLoading = false;
                                    this.isLoginLoading = false;
                                    this._snackBar.open(
                                        'Successfully generated ' +
                                            serviceName +
                                            ' credentials',
                                        'X',
                                        {
                                            duration: 3000,
                                            panelClass: ['success-snackbar'],
                                        }
                                    );
                                },
                                error: () => {
                                    this.isLoading = false;
                                    this.isLoginLoading = false;
                                    this._snackBar.open(
                                        'Error generating ' +
                                            serviceName +
                                            ' credentials',
                                        'X',
                                        {
                                            duration: 3000,
                                            panelClass: ['red-snackbar'],
                                        }
                                    );
                                },
                            });
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.isLoginLoading = false;
                    this._snackBar.open('Error getting your credentials', 'X', {
                        duration: 3000,
                        panelClass: ['red-snackbar'],
                    });
                },
            });
    }

    openCustomNextcloudDocumentationWeb(): void {
        const url =
            'https://docs.ai4eosc.eu/en/latest/user/overview/dashboard.html#storage-configuration';
        window.open(url);
    }
}
