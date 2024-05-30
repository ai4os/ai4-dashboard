import { TestBed } from '@angular/core/testing';

import { SecretsService } from './secrets.service';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { Secret } from '@app/shared/interfaces/module.interface';
import { of } from 'rxjs';

const secretsList: Array<Secret> = [{ token: '1234' }];

const mockedConfigService: any = {
    voName: 'vo.ai4eosc.eu',
};
const { base } = environment.api;

describe('SecretsService', () => {
    let service: SecretsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(SecretsService);
        httpMock = TestBed.inject(HttpTestingController);

        jest.mock('./secrets.service', () => ({
            getSecrets: jest.fn().mockReturnValue(of(secretsList)),
            createSecret: jest.fn().mockReturnValue(of({ status: 'success' })),
            deleteSecret: jest.fn().mockReturnValue(of({ status: 'success' })),
        }));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getSecrets should return a list of secrets', (done) => {
        const url = `${base}/secrets?vo=vo.ai4eosc.eu&subpath=/deployments/test`;

        service.getSecrets('/deployments/test').subscribe((list) => {
            try {
                expect(list).toBe(secretsList);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(secretsList);
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
