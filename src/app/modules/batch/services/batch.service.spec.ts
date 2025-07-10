import { TestBed } from '@angular/core/testing';

import { BatchService } from './batch.service';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { mockedBatchDeployments } from './batch.service.mock';

const { base, endpoints } = environment.api;

describe('BatchService', () => {
    let service: BatchService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(BatchService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getBatchDeployments should return a list of deployments', (done) => {
        const expectedURL = `${base}${endpoints.batchDeployments}?vos=vo.ai4eosc.eu`;

        service.getBatchDeployments().subscribe((deployments) => {
            try {
                expect(deployments).toEqual(mockedBatchDeployments);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(expectedURL);
        req.flush(mockedBatchDeployments);
        expect(req.request.method).toBe('GET');
    });

    it('getBatchDeploymentByUUID should return a single deployment', (done) => {
        const uuid = 'test-uuid';
        const expectedURL = `${base}${endpoints.batchDeploymentsByUUID.replace(':deploymentUUID', uuid)}?vo=vo.ai4eosc.eu`;

        service.getBatchDeploymentByUUID(uuid).subscribe((deployment) => {
            try {
                expect(deployment).toEqual(mockedBatchDeployments[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(expectedURL);
        req.flush(mockedBatchDeployments[0]);
        expect(req.request.method).toBe('GET');
    });

    it('deleteBatchDeploymentByUUID should send a DELETE request and return status', (done) => {
        const uuid = 'test-uuid';
        const expectedURL = `${base}${endpoints.batchDeploymentsByUUID.replace(':deploymentUUID', uuid)}?vo=vo.ai4eosc.eu`;

        service.deleteBatchDeploymentByUUID(uuid).subscribe((response) => {
            try {
                expect(response).toEqual({ status: 'success' });
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(expectedURL);
        req.flush({ status: 'success' });
        expect(req.request.method).toBe('DELETE');
    });
});
