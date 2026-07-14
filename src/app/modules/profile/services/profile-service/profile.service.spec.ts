import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { environment } from '@environments/environment';
import {
    mockedCredentials,
    mockedNewCredential,
} from '@app/modules/profile/services/profile-service/profile.service.mock';
import { COMMON_TEST_PROVIDERS } from '@app/shared/testing/test-providers';

describe('ProfileService', () => {
    let service: ProfileService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ...COMMON_TEST_PROVIDERS,

                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ProfileService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call initLogin with correct domain', () => {
        const domain = 'example.com';
        const mockResponse = { poll: { endpoint: '...', token: '...' } };

        service.initLogin(domain).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`https://${domain}/index.php/login/v2`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });

    it('should get new credentials with token', () => {
        const loginResponse = {
            poll: {
                endpoint: 'https://example.com/poll',
                token: '12345',
            },
            login: 'https://example.com/login',
        };

        const mockResp = {
            server: 'nextcloud',
            loginName: 'test',
            appPassword: 'pass',
        };

        service.getNewCredentials(loginResponse).subscribe((response) => {
            expect(response.body).toEqual(mockResp);
        });

        const req = httpMock.expectOne(loginResponse.poll.endpoint);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toBe('token=12345');
        expect(req.request.headers.get('Content-Type')).toBe(
            'application/x-www-form-urlencoded'
        );
        req.flush(mockResp, { status: 200, statusText: 'OK' });
    });

    it('should fetch existing credentials with vo and subpath', () => {
        service.getExistingCredentials().subscribe((creds) => {
            expect(creds).toEqual(mockedCredentials);
        });

        const req = httpMock.expectOne(
            (r) =>
                r.url ===
                    `${environment.api.base}${environment.api.endpoints.secrets}` &&
                r.params.get('vo') === 'vo.ai4eosc.eu' &&
                r.params.get('subpath') === '/services/storage'
        );

        expect(req.request.method).toBe('GET');
        req.flush(mockedCredentials);
    });

    it('should add a credential', () => {
        const serviceName = 'dropbox';

        service
            .addCredential(mockedNewCredential, serviceName)
            .subscribe((resp) => {
                expect(resp.status).toBe('success');
            });

        const req = httpMock.expectOne(
            (r) =>
                r.url ===
                    `${environment.api.base}${environment.api.endpoints.secrets}` &&
                r.params.get('secret_path') ===
                    `/services/storage/${serviceName}`
        );

        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockedNewCredential);
        req.flush({ status: 'success' });
    });

    it('should delete a credential', () => {
        const serviceName = 'nextcloud';

        service.deleteCredential(serviceName).subscribe((resp) => {
            expect(resp.status).toBe('success');
        });

        const req = httpMock.expectOne(
            (r) =>
                r.url ===
                    `${environment.api.base}${environment.api.endpoints.secrets}` &&
                r.params.get('secret_path') ===
                    `/services/storage/${serviceName}`
        );

        expect(req.request.method).toBe('DELETE');
        req.flush({ status: 'success' });
    });
});
