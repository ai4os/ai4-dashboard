import { UserProfile } from '@app/core/services/auth/auth.service';
import { OAuthEvent, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { BehaviorSubject, of, Subject } from 'rxjs';

const mockedUserProfile = {
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

export const mockedParsedUserProfile = new BehaviorSubject<UserProfile>({
    name: 'AI4EOSC Dasboard Test',
    isAuthorized: true,
    isOperator: true,
    email: 'test@ifca.unican.es',
    eduperson_entitlement: [
        'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=member#aai.egi.eu',
        'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=vm_operator#aai.egi.eu',
        'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=member#aai.egi.eu',
        'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=vm_operator#aai.egi.eu',
    ],
});

export const mockedAuthService: any = {
    analytics: {
        domain: 'localhost',
        src: 'http://locahost/js/script.js',
    },
    isAuthenticated: jest.fn(),
    userProfileSubject: mockedParsedUserProfile,
    getValue: jest.fn(() => mockedUserProfile),
    login: jest.fn(),
    logout: jest.fn(),
    loadUserProfile: jest
        .fn()
        .mockReturnValue(Promise.resolve(mockedUserProfile)),
    isDoneLoading$: new BehaviorSubject<boolean>(false),
    configure: jest.fn().mockReturnValue(void 0),
    hasValidAccessToken: jest.fn().mockReturnValue(true),
    setupAutomaticSilentRefresh: jest.fn().mockReturnValue(void 0),
    events: of(Subject<OAuthEvent>),
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
    restartSessionChecksIfStillLoggedIn: jest.fn().mockReturnValue(void 0),
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
};
