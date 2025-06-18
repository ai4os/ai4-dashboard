import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { environment } from '@environments/environment';
import { snapshotsListMock } from './storage.service.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';

const { base } = environment.api;

describe('StorageService', () => {
    let service: StorageService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(StorageService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getSnapshots should return an empty list', (done) => {
        const storageName = 'nextcloud.ifca.es';
        const expectedUrl = `${base}/storage/${storageName}/ls`;

        service.getSnapshots(storageName).subscribe((asyncData) => {
            try {
                expect(asyncData).toStrictEqual([]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('storage_name') === storageName &&
                r.params.get('vo') === 'vo.ai4eosc.eu' &&
                r.params.get('subpath') === 'ai4os-storage/tools/cvat/backups'
        );

        req.flush([]);
    });

    it('getSnapshots should return a list of detailed snapshots', (done) => {
        const storageName = 'nextcloud.ifca.es';
        const expectedUrl = `${base}/storage/${storageName}/ls`;

        service.getSnapshots(storageName).subscribe((asyncData) => {
            try {
                expect(asyncData).toEqual(snapshotsListMock);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('storage_name') === storageName &&
                r.params.get('vo') === 'vo.ai4eosc.eu' &&
                r.params.get('subpath') === 'ai4os-storage/tools/cvat/backups'
        );

        req.flush(snapshotsListMock);
    });

    it('deleteSnapshot should delete a snapshot and return status', (done) => {
        const storageName = 'nextcloud.ifca.es';
        const filePath = 'snapshot1.zip';
        const url = `${base}/storage/${storageName}/rm`;
        const expectedResponse = { status: 'success' };

        service.deleteSnapshot(storageName, filePath).subscribe((response) => {
            try {
                expect(response).toEqual(expectedResponse);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'DELETE' &&
                r.url === url &&
                r.params.get('storage_name') === storageName &&
                r.params.get('vo') === 'vo.ai4eosc.eu' &&
                r.params.get('subpath') ===
                    `ai4os-storage/tools/cvat/backups/${filePath}`
        );
        req.flush(expectedResponse);
    });
});
