import { TestBed } from '@angular/core/testing';

import { SecretsService } from './secrets.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedSecrets } from '@app/modules/deployments/services/secrets-service/secrets.service.mock';

const { base } = environment.api;

describe('SecretsService', () => {
    let service: SecretsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(SecretsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getSecrets should return a list of secrets', (done) => {
        const url = `${base}/secrets?vo=vo.ai4eosc.eu&subpath=/deployments/test`;

        service.getSecrets('/deployments/test').subscribe((list) => {
            try {
                expect(list).toBe(mockedSecrets);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(mockedSecrets);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('createSecret should create a new secret', (done) => {
        const url = `${base}/secrets?vo=vo.ai4eosc.eu&secret_path=/deployments/test/federared/client1`;
        const secret = { token: '1234' };
        service
            .createSecret(secret, '/deployments/test/federared/client1')
            .subscribe((response) => {
                try {
                    expect(response).toEqual({ status: 'success' });
                    done();
                } catch (error) {
                    done(error);
                }
            });

        const req = httpMock.expectOne(url);
        req.flush({ status: 'success' });
        httpMock.verify();
        expect(req.request.method).toBe('POST');
    });

    it('deleteSecret should delete a secret', (done) => {
        const url = `${base}/secrets?vo=vo.ai4eosc.eu&secret_path=/deployments/test/federated/client1`;
        service
            .deleteSecret('/deployments/test/federated/client1')
            .subscribe((response) => {
                try {
                    expect(response).toEqual({ status: 'success' });
                    done();
                } catch (error) {
                    done(error);
                }
            });

        const req = httpMock.expectOne(url);
        req.flush({ status: 'success' });
        httpMock.verify();
        expect(req.request.method).toBe('DELETE');
    });
});
