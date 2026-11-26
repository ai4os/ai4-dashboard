import {
    TestBed,
    fakeAsync,
    flush,
    flushMicrotasks,
} from '@angular/core/testing';
import { AuthService, UserProfile } from './auth.service';
import { OAuthModuleConfig, OAuthService } from 'angular-oauth2-oidc';
import { AppConfigService } from '../app-config/app-config.service';
import { CatalogModule } from '@app/modules/catalog/catalog.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { mockedOAuthModuleConfig } from '@app/shared/mocks/oauth.module.config.mock';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { BehaviorSubject } from 'rxjs';

const entitlement = (vo: string, role: string) =>
    `urn:geant:eosc-portal.eu:group:Platform Access:${vo}:role=${role}#aai.egi.eu`;

const accessToken = (entitlements: string[]) => {
    const payload = btoa(
        JSON.stringify({
            name: 'Test User',
            sub: 'test-user',
            email: 'test@example.org',
            eduperson_entitlement: entitlements,
        })
    );
    return `header.${payload}.signature`;
};

describe('AuthService', () => {
    let service: AuthService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([
                    { path: 'marketplace', component: CatalogModule },
                ]),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                AuthService,
                { provide: OAuthService, useValue: mockedAuthService },
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: OAuthModuleConfig,
                    useValue: mockedOAuthModuleConfig,
                },
            ],
        });

        service = TestBed.inject(AuthService);
        service.userProfileSubject = new BehaviorSubject<UserProfile | null>({
            sub: 'test-sub',
            name: 'AI4EOSC Dashboard Test',
            email: 'test@ifca.unican.es',
            roles: ['ap-d', 'ap-u', 'ap-a'],
            vos: [],
            isAuthenticated: true,
            isAuthorized: true,
            isProjectMember: true,
            isDeveloper: true,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('keeps grouped VOs separate and exposes their shared highest role', () => {
        const vos = service['buildVos']([
            entitlement('vo.fluid.ai4eosc.eu', 'ap-u'),
            entitlement('vo.arena.ai4eosc.eu', 'ap-a'),
            entitlement('vo.ai4eosc.eu', 'ap-a'),
        ]);
        const vosByName = new Map(vos.map((vo) => [vo.name, vo]));

        expect(vos).toHaveLength(3);
        expect(vosByName.get('vo.fluid.ai4eosc.eu')).toEqual({
            name: 'vo.fluid.ai4eosc.eu',
            roles: ['ap-u'],
            sharedHighestRole: 'ap-u',
        });
        expect(vosByName.get('vo.arena.ai4eosc.eu')).toEqual({
            name: 'vo.arena.ai4eosc.eu',
            roles: ['ap-a'],
            sharedHighestRole: 'ap-u',
        });
        expect(vosByName.get('vo.ai4eosc.eu')).toEqual({
            name: 'vo.ai4eosc.eu',
            roles: ['ap-a'],
            sharedHighestRole: 'ap-u',
        });
    });

    it('returns the same de-duplicated effective roles for every grouped VO', () => {
        const vos = service['buildVos']([
            entitlement('vo.fluid.ai4eosc.eu', 'ap-u'),
            entitlement('vo.fluid.ai4eosc.eu', 'ap-a'),
            entitlement('vo.arena.ai4eosc.eu', 'ap-a'),
            entitlement('vo.ai4eosc.eu', 'ap-b'),
        ]);
        const expected = ['ap-u', 'ap-b', 'ap-a'];

        for (const voName of [
            'vo.ai4eosc.eu',
            'vo.fluid.ai4eosc.eu',
            'vo.arena.ai4eosc.eu',
        ]) {
            expect(service.getEffectiveRoles(voName, vos)).toEqual(expected);
        }
    });

    it('does not share roles with VOs outside the AI4EOSC group', () => {
        const vos = service['buildVos']([
            entitlement('vo.ai4eosc.eu', 'ap-u'),
            entitlement('vo.ai4life.eu', 'ap-a'),
        ]);

        expect(service.getEffectiveRoles('vo.ai4eosc.eu', vos)).toEqual([
            'ap-u',
        ]);
        expect(service.getEffectiveRoles('vo.ai4life.eu', vos)).toEqual([
            'ap-a',
        ]);
    });

    it('uses effective roles and derives authorization flags from them', fakeAsync(() => {
        const entitlements = [
            entitlement('vo.fluid.ai4eosc.eu', 'ap-u'),
            entitlement('vo.arena.ai4eosc.eu', 'ap-a'),
            entitlement('vo.ai4eosc.eu', 'ap-a'),
        ];
        mockedAuthService.getAccessToken.mockReturnValue(
            accessToken(entitlements)
        );

        for (const voName of [
            'vo.ai4eosc.eu',
            'vo.fluid.ai4eosc.eu',
            'vo.arena.ai4eosc.eu',
        ]) {
            mockedConfigService.voName = voName;
            service.loadUserProfile();
            flushMicrotasks();

            expect(service.userProfileSubject.value).toMatchObject({
                roles: ['ap-u', 'ap-a'],
                isDeveloper: false,
                isProjectMember: true,
                isAuthorized: true,
                isAuthenticated: true,
            });
        }
    }));

    it('derives all access flags for developer, authorized, and basic access roles', fakeAsync(() => {
        for (const [role, flags] of [
            [
                'ap-d',
                {
                    isDeveloper: true,
                    isProjectMember: true,
                    isAuthorized: true,
                    isAuthenticated: true,
                },
            ],
            [
                'ap-a',
                {
                    isDeveloper: false,
                    isProjectMember: false,
                    isAuthorized: true,
                    isAuthenticated: true,
                },
            ],
            [
                'ap-0',
                {
                    isDeveloper: false,
                    isProjectMember: false,
                    isAuthorized: false,
                    isAuthenticated: true,
                },
            ],
        ] as const) {
            mockedConfigService.voName = 'vo.ai4eosc.eu';
            mockedAuthService.getAccessToken.mockReturnValue(
                accessToken([entitlement('vo.fluid.ai4eosc.eu', role)])
            );
            service.loadUserProfile();
            flushMicrotasks();

            expect(service.userProfileSubject.value).toMatchObject(flags);
        }
    }));

    it('configure the service correctly', fakeAsync(() => {
        jest.spyOn(service, 'isAuthenticated').mockReturnValue(true);
        const spyLoadDiscoveryDocumentAndTryLogin = jest.spyOn(
            mockedAuthService,
            'loadDiscoveryDocumentAndTryLogin'
        );

        service.configureOAuthService();
        service.login();

        expect(spyLoadDiscoveryDocumentAndTryLogin).toHaveBeenCalled();

        service.userProfileSubject.subscribe((profile) => {
            expect(profile).toMatchObject({
                isAuthorized: true,
                name: 'AI4EOSC Dashboard Test',
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
