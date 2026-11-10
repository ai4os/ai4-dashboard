import { Injectable, Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthModuleConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, combineLatest, filter, map } from 'rxjs';
import { authCodeFlowConfig } from './auth.config';
import { AppConfigService } from '../app-config/app-config.service';
import { jwtDecode } from 'jwt-decode';
import { KeycloakToken } from '@app/shared/interfaces/keycloak-token.interface';

export interface VoAccess {
    name: string; // "vo.ai4eosc.eu"
    roles: string[]; // ["ap-d", "ap-u", ...] sorted by level
}

export interface UserProfile {
    name: string;
    email: string;
    sub: string;
    roles: string[]; // roles for the current vo
    vos: VoAccess[]; // roles for all the vos
    isAuthenticated: boolean; // ap-0
    isAuthorized: boolean; // ap-a, ap-a1, ap-b
    isProjectMember: boolean; // ap-u
    isDeveloper: boolean; // ap-d
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly oauthService = inject(OAuthService);
    private readonly injector = inject(Injector);
    private readonly appConfigService = inject(AppConfigService);
    private readonly oauthConfig = inject(OAuthModuleConfig);

    constructor() {
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

        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            this.userProfileSubject.next(JSON.parse(savedProfile));
        }
    }

    private readonly isAuthenticatedSubject$ = new BehaviorSubject<boolean>(
        false
    );
    public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

    private readonly isDoneLoadingSubject$ = new BehaviorSubject<boolean>(
        false
    );
    public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

    public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
        this.isAuthenticated$,
        this.isDoneLoading$,
    ]).pipe(map((values) => values.every((b) => b)));

    userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
    public userProfile$ = this.userProfileSubject.asObservable();

    get router() {
        return this.injector.get(Router);
    }

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

    private static readonly ACCESS_GROUP = 'Platform Access';
    private static readonly ACCESS_ORDER = [
        'ap-d',
        'ap-u',
        'ap-b',
        'ap-a1',
        'ap-a',
        'ap-0',
    ];

    // Not all Keycloak VOs have their corresponding PAPI/Dashboard VO.
    // Keep in sync with `vo_mappings` in the API (ai4papi main conf).
    private static readonly VO_MAPPINGS: Record<string, string> = {
        'vo.fluid.ai4eosc.eu': 'vo.ai4eosc.eu',
        'vo.arena.ai4eosc.eu': 'vo.ai4eosc.eu',
    };

    private buildVos(entitlements: string[]): VoAccess[] {
        const byVo = new Map<string, Set<string>>();

        for (const raw of entitlements) {
            const e = this.parseEntitlement(raw);
            if (!e || e.group !== AuthService.ACCESS_GROUP) continue;

            const role = e.role.toLowerCase().replace(/^access-/, '');
            if (!AuthService.ACCESS_ORDER.includes(role)) continue;

            // Map Keycloak VO to the Dashboard/PAPI VO if needed
            const vo = AuthService.VO_MAPPINGS[e.vo] ?? e.vo;

            if (!byVo.has(vo)) byVo.set(vo, new Set());
            byVo.get(vo)!.add(role);
        }

        const order = AuthService.ACCESS_ORDER;
        const currentVo = this.appConfigService.voName;

        return (
            [...byVo.entries()]
                .map(([name, roles]) => ({
                    name,
                    roles: [...roles].sort(
                        (a, b) => order.indexOf(a) - order.indexOf(b)
                    ),
                }))
                // current VO first
                .sort((a, b) =>
                    a.name === currentVo ? -1 : b.name === currentVo ? 1 : 0
                )
        );
    }

    private parseEntitlement(
        raw: string
    ): { group: string; vo: string; role: string } | null {
        let decoded: string;
        try {
            decoded = decodeURIComponent(raw);
        } catch {
            return null;
        }
        decoded = decoded.split('#')[0];

        const match =
            /^urn:geant:eosc-portal\.eu:group:([^:]+):([^:]+):role=(.+)$/.exec(
                decoded
            );
        if (!match) return null;
        return { group: match[1], vo: match[2], role: match[3] };
    }

    loadUserProfile() {
        const token = this.oauthService.getAccessToken();
        const parsedToken = jwtDecode(token) as KeycloakToken;

        const rawEntitlements = parsedToken.eduperson_entitlement ?? [];
        const entitlements = Array.isArray(rawEntitlements)
            ? rawEntitlements
            : [rawEntitlements];

        // Access levels for every VO, and for the current VO only
        const vos = this.buildVos(entitlements);
        const roles =
            vos.find((v) => v.name === this.appConfigService.voName)?.roles ??
            [];

        const has = (r: string) => roles.includes(r);

        const isDeveloper = has('ap-d');
        const isProjectMember = isDeveloper || has('ap-u');
        const isAuthorized =
            isProjectMember || ['ap-a', 'ap-a1', 'ap-b'].some(has);
        const isAuthenticated = isAuthorized || has('ap-0');

        const userProfile: UserProfile = {
            name: parsedToken.name,
            sub: parsedToken.sub,
            email: parsedToken.email,
            roles,
            vos,
            isAuthenticated,
            isAuthorized,
            isProjectMember,
            isDeveloper,
        };

        this.oauthService.loadUserProfile().then(() => {
            this.userProfileSubject.next(userProfile);
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
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

        // save 'on boarding library' and 'access level' related variables
        const variables: Record<string, string | null> = {};
        for (const key of Object.keys(localStorage)) {
            if (key.endsWith('Tour') || key.includes('accessLevel')) {
                variables[key] = localStorage.getItem(key);
            }
        }

        // clear all local storage variables
        localStorage.clear();

        // restore 'on boarding library' and 'access level' related variables
        for (const [key, value] of Object.entries(variables)) {
            if (value !== null) {
                localStorage.setItem(key, value);
            }
        }
    }

    isAuthenticated(): boolean {
        return !!this.oauthService.getIdToken();
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
