import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import {
    BehaviorSubject,
    Observable,
    Subject,
    combineLatest,
    filter,
    map,
} from 'rxjs';
import { authCodeFlowConfig } from './auth.config';
import { AppConfigService } from '../app-config/app-config.service';

export interface UserProfile {
    name: string;
    email: string;
    group_membership: string[];
    isAuthorized: boolean;
    isDeveloper: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private oauthService: OAuthService,
        private injector: Injector,
        private appConfigService: AppConfigService
    ) {
        window.addEventListener('storage', (event) => {
            // The `key` is `null` if the event was caused by `.clear()`
            if (event.key !== 'access_token' && event.key !== null) {
                return;
            }

            console.warn(
                'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
            );
            this.isAuthenticatedSubject$.next(
                this.oauthService.hasValidAccessToken()
            );

            if (!this.oauthService.hasValidAccessToken()) {
                //this.navigateToLoginPage();
            }
        });

        this.oauthService.events.subscribe(() => {
            this.isAuthenticatedSubject$.next(
                this.oauthService.hasValidAccessToken()
            );
        });
        this.isAuthenticatedSubject$.next(
            this.oauthService.hasValidAccessToken()
        );

        this.oauthService.events
            .pipe(filter((e) => ['token_received'].includes(e.type)))
            .subscribe(() => {
                this.oauthService.loadUserProfile();
            });

        this.oauthService.events
            .pipe(
                filter((e) =>
                    ['session_terminated', 'session_error'].includes(e.type)
                )
            )
            .subscribe((e) => console.warn('Navegando a login'));

        this.oauthService.configure(authCodeFlowConfig);
        this.oauthService.setupAutomaticSilentRefresh();
    }

    private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

    private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
    public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

    public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
        this.isAuthenticated$,
        this.isDoneLoading$,
    ]).pipe(map((values) => values.every((b) => b)));

    userProfileSubject = new Subject<UserProfile>();

    get router() {
        return this.injector.get(Router);
    }

    public runInitialLoginSequence(state?: string): Promise<void> {
        // 0. LOAD CONFIG:
        return (
            this.oauthService
                .loadDiscoveryDocument()
                // 1. HASH LOGIN:
                .then(() => this.oauthService.tryLogin())

                .then(() => {
                    if (this.oauthService.hasValidAccessToken()) {
                        this.loadUserProfile();
                        return Promise.resolve();
                    } else if (this.oauthService.getAccessToken() !== null) {
                        // 2. SILENT LOGIN:
                        return this.oauthService
                            .refreshToken()
                            .then(() => Promise.resolve())
                            .catch((result) => {
                                // Subset of situations from https://openid.net/specs/openid-connect-core-1_0.html#AuthError
                                const errorResponsesRequiringUserInteraction = [
                                    'interaction_required',
                                    'login_required',
                                    'account_selection_required',
                                    'consent_required',
                                ];
                                if (
                                    result &&
                                    result.reason &&
                                    errorResponsesRequiringUserInteraction.indexOf(
                                        result.reason.error
                                    ) >= 0
                                ) {
                                    // 3. ASK FOR LOGIN:
                                    this.login(state);
                                    return Promise.resolve();
                                } else {
                                    this.logout();
                                }
                                return Promise.reject(result);
                            });
                    }
                    return Promise.reject();
                })

                .then(() => {
                    this.isDoneLoadingSubject$.next(true);
                    if (
                        this.oauthService.state &&
                        this.oauthService.state !== 'undefined' &&
                        this.oauthService.state !== 'null'
                    ) {
                        this.loadUserProfile();
                        if (
                            this.oauthService.state &&
                            this.oauthService.state !== 'undefined' &&
                            this.oauthService.state !== 'null'
                        ) {
                            let stateUrl = this.oauthService.state;
                            if (stateUrl.startsWith('/') === false) {
                                stateUrl = decodeURIComponent(stateUrl);
                            }
                            this.router.navigateByUrl(stateUrl);
                        }
                        let stateUrl = this.oauthService.state;
                        if (stateUrl.startsWith('/') === false) {
                            stateUrl = decodeURIComponent(stateUrl);
                        }
                        this.router.navigateByUrl(stateUrl);
                    }
                })
                .catch(() => {
                    this.isDoneLoadingSubject$.next(true);
                })
        );
    }

    loadUserProfile() {
        this.oauthService.loadUserProfile().then((profile: any) => {
            const userProfile: UserProfile = {
                name: profile['info']['name'],
                isAuthorized: false,
                isDeveloper: false,
                email: profile['info']['email'],
                group_membership: profile['info']['group_membership'],
            };
            if (
                profile['info']['group_membership'] &&
                profile['info']['group_membership'].length > 0
            ) {
                const vos: string[] = this.parseVosFromProfile(
                    profile['info']['group_membership']
                );
                vos.forEach((vo) => {
                    if (vo.includes(this.appConfigService.voName)) {
                        userProfile.isAuthorized = true;
                    }
                });
                const roles: string[] = this.parseRolesFromProfile(
                    profile['info']['group_membership']
                );
                roles.forEach((role) => {
                    if (role.includes('Developer Access')) {
                        userProfile.isDeveloper = true;
                    }
                });
            }
            this.userProfileSubject.next(userProfile);
        });
    }

    /**
     * Configure the oauth service, tries to login and saves the user profile for display.
     *
     *
     * @memberof AuthService
     */
    configureOAuthService() {
        this.oauthService.configure(authCodeFlowConfig);
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService
            .loadDiscoveryDocumentAndTryLogin()
            .then((isLoggedIn) => {
                if (isLoggedIn && this.isAuthenticated()) {
                    if (this.oauthService.hasValidAccessToken()) {
                        if (
                            this.oauthService.state &&
                            this.oauthService.state !== 'undefined' &&
                            this.oauthService.state !== 'null'
                        ) {
                            let stateUrl = this.oauthService.state;
                            if (stateUrl.startsWith('/') === false) {
                                stateUrl = decodeURIComponent(stateUrl);
                            }
                            this.router.navigateByUrl(stateUrl);
                        }
                    } else {
                        // Force logout as we have no access to refresh tokens without client secret
                        this.logout();
                    }
                }
            });
    }

    login(url?: string) {
        this.oauthService.initLoginFlow(url);
    }

    logout() {
        if (this.oauthService.hasValidIdToken()) {
            this.oauthService.logOut(true);
        }
        this.router.navigateByUrl('/marketplace');

        // do not remove 'on boarding library' related variables
        const tourName = 'ai4lifeMarketplaceTour';
        const value = localStorage.getItem('ai4lifeMarketplaceTour');
        localStorage.clear();
        if (value) {
            localStorage.setItem(tourName, value);
        }
    }

    isAuthenticated(): boolean {
        return !!this.oauthService.getIdToken();
    }

    parseVosFromProfile(group_membership: string[]): string[] {
        const vos: string[] = [];

        group_membership.forEach((vo) => {
            const groupMatch = vo.match(
                /^\/(Platform Access|Developer Access)\/([^\/]+)/
            );
            if (groupMatch) {
                const voName = groupMatch[2];
                if (!vos.includes(voName)) {
                    vos.push(voName);
                }
            } else if (vo === '/Demo Access' && !vos.includes('demo')) {
                vos.push('demo');
            }
        });

        return vos;
    }

    parseRolesFromProfile(group_membership: string[]): string[] {
        const roles: string[] = [];

        group_membership.forEach((e) => {
            const groupMatch = e.match(
                /^\/(Platform Access|Developer Access)\/([^\/]+)/
            );

            if (groupMatch) {
                const accessType = groupMatch[1];
                if (!roles.includes(accessType)) {
                    roles.push(accessType);
                }
            } else if (e === '/Demo Access' && !roles.includes('Demo Access')) {
                roles.push('Demo Access');
            }
        });

        return roles;
    }
}
