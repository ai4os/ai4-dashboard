import { TestBed } from '@angular/core/testing';

import { OscarInferenceService } from './oscar-inference.service';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';
import { OscarService } from '@app/shared/interfaces/oscar-service.interface';
import { environment } from '@environments/environment';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedOscarServices } from '@app/modules/inference/services/oscar-inference.service.mock';

const { base, endpoints } = environment.api;

describe('OscarInferenceService', () => {
    let service: OscarInferenceService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });

        service = TestBed.inject(OscarInferenceService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get services', () => {
        service.getServices().subscribe((res) => {
            expect(res).toEqual(mockedOscarServices);
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === `${base}${endpoints.oscarServices}` &&
                r.params.get('vo') === mockedConfigService.voName &&
                r.params.get('public') === 'false'
        );

        expect(req.request.method).toBe('GET');
        req.flush(mockedOscarServices);
    });

    it('should get service by name', () => {
        const serviceName = 'Oscar Service Mock Title';

        service.getServiceByName(serviceName).subscribe((res) => {
            expect(res).toEqual(mockedOscarServices[0]);
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url ===
                    `${base}${endpoints.oscarServiceByName.replace(':serviceName', serviceName)}` &&
                r.params.get('vo') === mockedConfigService.voName
        );

        expect(req.request.method).toBe('GET');
        req.flush(mockedOscarServices[0]);
    });

    it('should create a service', () => {
        const mockRequest: TrainModuleRequest = {
            name: 'new-service',
            // ... otros campos necesarios del interface
        } as any;

        const mockResponse = 'new-service';

        service.createService(mockRequest).subscribe((res) => {
            expect(res).toBe(mockResponse);
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'POST' &&
                r.url === `${base}${endpoints.oscarServices}` &&
                r.params.get('vo') === mockedConfigService.voName
        );

        expect(req.request.body).toEqual(mockRequest);
        req.flush(mockResponse);
    });

    it('should delete a service by name', () => {
        const serviceName = 'mock-uuid';

        service.deleteServiceByName(serviceName).subscribe((res) => {
            expect(res).toBe(serviceName);
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'DELETE' &&
                r.url ===
                    `${base}${endpoints.oscarServiceByName.replace(':serviceName', serviceName)}` &&
                r.params.get('vo') === mockedConfigService.voName &&
                r.params.get('service_name') === serviceName
        );

        expect(req.request.method).toBe('DELETE');
        req.flush(serviceName);
    });
});
