import { TestBed } from '@angular/core/testing';

import { ZenodoService } from './zenodo.service';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { datasets } from './zenodo.service.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { of } from 'rxjs';

const { base, endpoints } = environment.api;

const mockedConfigService: any = {};
const datasetListMock = datasets;

describe('ZenodoService', () => {
    let service: ZenodoService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ZenodoService);
        httpMock = TestBed.inject(HttpTestingController);
        jest.mock('./zenodo.service', () => ({
            getDatasets: jest.fn().mockReturnValue(of(datasetListMock)),
        }));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getDatasets should return a list of datasets', (done) => {
        const url = `${base}${endpoints.zenodo}?api_route=communities/ai4eosc/records`;

        service.getDatasets().subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(datasetListMock);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(datasetListMock);
        httpMock.verify();
        expect(req.request.method).toBe('POST');
    });
});
