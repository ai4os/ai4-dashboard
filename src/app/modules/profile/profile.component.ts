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
    RcloneCredential,
    RequestLoginResponse,
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

    protected name: string = '';
    protected email: string = '';
    protected vos: VoInfo[] = [];
    protected ai4osEndpoint =
        'https://share.services.ai4os.eu/index.php/login/v2';
    protected customEndpoint = 'https://<your.domain>/index.php/login/v2';
    customEndpointFormGroup = this.fb.group({
        value: [
            'https://<your.domain>/index.php/login/v2',
            [Validators.required],
        ],
    });

    // TODO: turn this into an array
    protected serviceCredentials: RcloneCredential[] = [];

    ngOnInit(): void {
        this.authService.userProfileSubject.subscribe((profile) => {
            this.name = profile.name;
            this.email = profile.email;
            this.getVoInfo(profile.eduperson_entitlement);
            this.isLoading = false;
        });
        this.serviceCredentials = this.getExistingRcloneCredentials();
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

            let index = this.vos.findIndex((v) => v.name === voName);
            if (index !== -1) {
                this.vos[index].roles.push(role);
            } else {
                let newVo = { name: voName, roles: [role] };
                this.vos.push(newVo);
            }
        });
    }

    getExistingRcloneCredentials(): RcloneCredential[] {
        throw new Error('Method not implemented.');
    }

    syncRclone(url: string) {
        this.isLoading = true;
        this.isLoginLoading = true;
        console.log(url);
        this.profileService.initLogin(url).subscribe({
            next: (response) => {
                this.loginResponse = response;
                window.open(response.login, '_blank');
                this.pollRcloneCredentials();
            },
            error: () => {
                this.isLoading = false;
                this.isLoginLoading = false;
                this._snackBar.open('Error syncronizing your account', 'X', {
                    duration: 3000,
                    panelClass: ['red-snackbar'],
                });
            },
        });
    }

    pollRcloneCredentials() {
        interval(2000) // Intervalo de 2 segundos
            .pipe(
                switchMap(() =>
                    this.profileService.getCredentials(this.loginResponse).pipe(
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
                    this._snackBar.open('Error getting your credentials', 'X', {
                        duration: 3000,
                        panelClass: ['red-snackbar'],
                    });
                })
            )
            .subscribe({
                next: (response) => {
                    if (response.status === 200) {
                        console.log('Success:', response.body);
                        this.isLoading = false;
                        this.isLoginLoading = false;

                        // TODO: manejar la respuesta
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
}
