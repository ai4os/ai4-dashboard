import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthModuleConfig, OAuthService } from 'angular-oauth2-oidc';
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
import { ProfileService } from '@app/modules/profile/services/profile.service';

export interface UserProfile {
    name: string;
    email: string;
    eduperson_entitlement: string[];
    isAuthorized: boolean;
    isOperator: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    get router() {
        return this.injector.get(Router);
    }
    constructor(
        private oauthService: OAuthService,
        private injector: Injector,
        private appConfigService: AppConfigService,
        private profileService: ProfileService,
        private oauthConfig: OAuthModuleConfig
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

    userProfileSubject = new BehaviorSubject<UserProfile>({
        name: '',
        email: '',
        eduperson_entitlement: [],
        isAuthorized: false,
        isOperator: false,
    });

    private async prepareOAuthService(): Promise<void> {
        // Load configuration
        await this.appConfigService.loadAppConfig(this.oauthConfig);

        // Configure issuer and clientId
        if (
            this.appConfigService.issuer &&
            this.appConfigService.clientId &&
            this.appConfigService.issuer !== '' &&
            this.appConfigService.clientId !== ''
        ) {
            authCodeFlowConfig.issuer = this.appConfigService.issuer;
            authCodeFlowConfig.clientId = this.appConfigService.clientId;
        }

        // Some OICD providers require dummyClientSecret
        if (
            this.appConfigService.dummyClientSecret &&
            this.appConfigService.dummyClientSecret !== ''
        ) {
            authCodeFlowConfig.dummyClientSecret =
                this.appConfigService.dummyClientSecret;
        }

        // Apply configuration
        this.oauthService.configure(authCodeFlowConfig);
        this.oauthService.setupAutomaticSilentRefresh();
        await this.oauthService.loadDiscoveryDocument();
    }

    public async checkLoginSequence(): Promise<void> {
        const isHuggingFaceRedirect =
            window.location.pathname === '/profile/huggingface-callback';

        if (isHuggingFaceRedirect) {
            await this.prepareOAuthService();
            this.isDoneLoadingSubject$.next(true);
            return Promise.resolve();
        }

        return this.runInitialLoginSequence();
    }

    public async runInitialLoginSequence(state?: string): Promise<void> {
        await this.prepareOAuthService();

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
                isOperator: false,
                email: profile['info']['email'],
                eduperson_entitlement: profile['info']['eduperson_entitlement'],
            };
            if (
                profile['info']['eduperson_entitlement'] &&
                profile['info']['eduperson_entitlement'].length > 0
            ) {
                const vos: string[] = this.parseVosFromProfile(
                    profile['info']['eduperson_entitlement']
                );
                vos.forEach((vo) => {
                    if (vo.includes(this.appConfigService.voName)) {
                        userProfile.isAuthorized = true;
                    }
                });
                const roles: string[] = this.parseRolesFromProfile(
                    profile['info']['eduperson_entitlement']
                );
                roles.forEach((role) => {
                    if (role.includes('vm_operator')) {
                        userProfile.isOperator = true;
                    }
                });
            }
            this.userProfileSubject.next(userProfile);
        });
    }

    login(url?: string) {
        this.oauthService.initLoginFlow(url);
    }

    logout() {
        if (this.oauthService.hasValidIdToken()) {
            this.oauthService.logOut(true);
        }
        this.router.navigateByUrl('/catalog/modules');

        // save 'on boarding library' related variables
        const tours: { [key: string]: string | null } = {};
        for (const key of Object.keys(localStorage)) {
            if (key.endsWith('Tour')) {
                tours[key] = localStorage.getItem(key);
            }
        }

        // clear all local storage variables
        localStorage.clear();

        // restore 'on boarding library' related variables
        for (const [key, value] of Object.entries(tours)) {
            if (value !== null) {
                localStorage.setItem(key, value);
            }
        }
    }

    isAuthenticated(): boolean {
        return !!this.oauthService.getIdToken();
    }

    parseVosFromProfile(entitlements: string[]): string[] {
        const foundVos: string[] = [];
        entitlements.forEach((vo) => {
            if (vo.match('group:(.+?):')?.[0]) {
                foundVos.push(vo.match('group:(.+?):')![0]);
            }
        });
        return foundVos;
    }

    parseRolesFromProfile(entitlements: string[]): string[] {
        const foundRoles: string[] = [];
        entitlements.forEach((role) => {
            if (role.match('role=(.+)#')?.[0]) {
                foundRoles.push(role.match('role=(.+)#')![0]);
            }
        });
        return foundRoles;
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
}
