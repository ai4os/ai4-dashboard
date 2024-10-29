import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
    OAuthEvent,
    OAuthService,
    OAuthSuccessEvent,
} from 'angular-oauth2-oidc';
import { AppConfigService } from '../app-config/app-config.service';
import { Subject, of } from 'rxjs';
import { MarketplaceModule } from '@app/modules/marketplace/marketplace.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

const mockedProfile = {
    info: {
        exp: 1693908513,
        iat: 1693907913,
        auth_time: 1693907911,
        jti: '00000000-c9e1-44b7-b313-4bde8fba70fa',
        iss: 'https://aai-demo.egi.eu/auth/realms/egi',
        aud: 'ai4eosc-dashboard',
        sub: 'test@egi.eu',
        typ: 'ID',
        azp: 'ai4eosc-dashboard',
        nonce: 'WnVHR3ZpOVoyVlFwcjVGTEtIRWhyUTZ0eXJYVHZxN1M4TX5MRzVKWVJYVHZx',
        session_state: '00000000-818c-46d4-ad87-1b9a1c22c43f',
        at_hash: 'gdEA9VsgdEA9V-mubWhBWw',
        sid: 'b27a9b7a-818c-46d4-ad87-1b9a1818c43f',
        voperson_verified_email: ['test@ifca.unican.es'],
        email_verified: true,
        name: 'AI4EOSC Dasboard Test',
        preferred_username: 'ai4dash',
        eduperson_assurance: [
            'https://refeds.org/assurance/IAP/low',
            'https://aai.egi.eu/LoA#Low',
        ],
        given_name: 'AI4EOSC Dasboard ',
        family_name: 'Test',
        email: 'test@ifca.unican.es',
        eduperson_entitlement: [
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=vm_operator#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=vm_operator#aai.egi.eu',
        ],
    },
};

const mockedOAuthService = {
    configure: jest.fn().mockReturnValue(void 0),
    hasValidAccessToken: jest.fn().mockReturnValue(true),
    loadDiscoveryDocument: jest
        .fn()
        .mockReturnValue(
            Promise.resolve(new OAuthSuccessEvent('discovery_document_loaded'))
        ),
    loadDiscoveryDocumentAndLogin: jest
        .fn()
        .mockReturnValue(Promise.resolve(false)),
    loadDiscoveryDocumentAndTryLogin: jest
        .fn()
        .mockReturnValue(Promise.resolve(true)),
    loadUserProfile: jest.fn().mockReturnValue(Promise.resolve(mockedProfile)),
    restartSessionChecksIfStillLoggedIn: jest.fn().mockReturnValue(void 0),
    setupAutomaticSilentRefresh: jest.fn().mockReturnValue(void 0),
    silentRefresh: jest
        .fn()
        .mockReturnValue(
            Promise.resolve(new OAuthSuccessEvent('silently_refreshed'))
        ),
    stopAutomaticRefresh: jest.fn().mockReturnValue(void 0),
    tryLogin: jest.fn().mockReturnValue(Promise.resolve(false)),
    tryLoginCodeFlow: jest.fn().mockReturnValue(Promise.resolve(void 0)),
    tryLoginImplicitFlow: jest.fn().mockReturnValue(Promise.resolve(false)),
    logOut: jest.fn(),
    getIdToken: jest.fn().mockReturnValue(Promise.resolve('dasdsad')),
    hasValidIdToken: jest.fn().mockReturnValue(Promise.resolve(true)),
    initLoginFlow: jest.fn(),
    events: of(Subject<OAuthEvent>),
};

const mockedConfigService: any = {
    voName: 'vo.ai4eosc.eu',
};

describe('AuthService', () => {
    let service: AuthService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([
                    { path: 'marketplace', component: MarketplaceModule },
                ]),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                AuthService,
                { provide: OAuthService, useValue: mockedOAuthService },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });

        service = TestBed.inject(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('configure the service correctly', fakeAsync(() => {
        jest.spyOn(service, 'isAuthenticated').mockReturnValue(true);
        const spyLoadDiscoveryDocumentAndTryLogin = jest.spyOn(
            mockedOAuthService,
            'loadDiscoveryDocumentAndTryLogin'
        );
        service.configureOAuthService();
        expect(spyLoadDiscoveryDocumentAndTryLogin).toHaveBeenCalled();
        service.userProfileSubject.subscribe((profile) => {
            expect(profile).toMatchObject({
                isAuthorized: true,
                name: 'AI4EOSC Dasboard Test',
            });
        });
        flush();
    }));

    it('shoulds login correctly', () => {
        const spyInitLoginFlow = jest.spyOn(
            service['oauthService'],
            'initLoginFlow'
        );
        service.login('/test');
        expect(spyInitLoginFlow).toHaveBeenCalledTimes(1);
        expect(spyInitLoginFlow).toHaveReturned();
    });

    it('should logout correctly when user has a valid id token', () => {
        const spyLogOut = jest.spyOn(service['oauthService'], 'logOut');
        const spyHasValidIdToken = jest.spyOn(
            service['oauthService'],
            'hasValidIdToken'
        );
        localStorage.setItem('test-key', 'test-value');
        service.logout();
        expect(spyHasValidIdToken).toHaveBeenCalledTimes(1);
        expect(spyLogOut).toHaveBeenCalledTimes(1);
        expect(spyLogOut).toHaveReturned();
        expect(localStorage).toMatchObject({});
    });

    it('should logout correctly when user DOES NOT have a valid id token', () => {
        const spyLogOut = jest.spyOn(service['oauthService'], 'logOut');
        const spyHasValidIdToken = jest
            .spyOn(service['oauthService'], 'hasValidIdToken')
            .mockReturnValue(false);
        localStorage.setItem('test-key', 'test-value');
        service.logout();
        expect(spyHasValidIdToken).toHaveBeenCalledTimes(1);
        expect(spyLogOut).toHaveBeenCalledTimes(0);
        expect(localStorage).toMatchObject({});
    });
});
