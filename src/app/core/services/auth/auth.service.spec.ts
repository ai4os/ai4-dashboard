import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { OAuthModuleConfig, OAuthService } from 'angular-oauth2-oidc';
import { AppConfigService } from '../app-config/app-config.service';
import { CatalogModule } from '@app/modules/catalog/catalog.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import {
    mockedAuthService,
    mockedParsedUserProfile,
} from '@app/core/services/auth/auth-service.mock';
import { mockedOAuthModuleConfig } from '@app/shared/mocks/oauth.module.config.mock';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';

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
        service.userProfileSubject = mockedParsedUserProfile;
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
