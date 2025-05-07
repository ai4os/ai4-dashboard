import { TestBed } from '@angular/core/testing';

import { ZenodoService } from './zenodo.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import {
    mockedCommunities,
    mockedDatasets,
    mockedVersions,
} from './zenodo.service.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { provideHttpClient } from '@angular/common/http';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';

const { base, endpoints } = environment.api;

const datasetListMock = mockedDatasets;
const datasetVersionsListMock = mockedVersions;

describe('ZenodoService', () => {
    let service: ZenodoService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ZenodoService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getCommunities should return a list of Zenodo communities', (done) => {
        const expectedUrl = '../../../assets/json/zenodo_communities.json';

        service.getCommunities().subscribe((data) => {
            try {
                expect(data).toBe(mockedCommunities);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) => r.method === 'GET' && r.url === expectedUrl
        );

        req.flush(mockedCommunities);
        httpMock.verify();
    });

    it('getDatasets should return a list of datasets', (done) => {
        const expectedUrl = `${base}${endpoints.zenodo}`;
        const expectedParam = 'communities/ai4eosc/records';

        service.getDatasets('ai4eosc').subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(datasetListMock);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'POST' &&
                r.url === expectedUrl &&
                r.params.get('api_route') === expectedParam
        );

        req.flush(datasetListMock);
        httpMock.verify();
    });

    it('getDatasetVersions should return a list of versions', (done) => {
        const id = '10777412';
        const expectedUrl = `${base}${endpoints.zenodo}`;
        const expectedParam = 'records/' + id + '/versions';

        service.getDatasetVersions('10777412').subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(datasetVersionsListMock);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'POST' &&
                r.url === expectedUrl &&
                r.params.get('api_route') === expectedParam
        );

        req.flush(datasetVersionsListMock);
        httpMock.verify();
    });

    it('getDataset should return a dataset by ID', (done) => {
        const id = '5678';
        const expectedUrl = `${base}${endpoints.zenodo}`;
        const expectedParam = 'records/' + id;

        service.getDataset(id).subscribe((data) => {
            try {
                expect(data).toBe(mockedDatasets[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'POST' &&
                r.url === expectedUrl &&
                r.params.get('api_route') === expectedParam
        );

        req.flush(mockedDatasets[0]);
        httpMock.verify();
    });
});
