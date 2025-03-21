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

const { base } = environment.api;

const mockedConfigService: any = {
    voName: 'vo.ai4eosc.eu',
};

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
        jest.mock('./storage.service', () => ({
            getSnapshots: jest
                .fn()
                .mockReturnValueOnce(of([]))
                .mockReturnValue(of(snapshotsListMock)),
        }));
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getSnapshots should return an empty list', (done) => {
        const storageName = 'nextcloud.ifca.es';
        const url =
            `${base}/storage/` +
            storageName +
            `/ls?storage_name=` +
            storageName +
            `&vo=vo.ai4eosc.eu&subpath=ai4os-storage/tools/cvat/backups`;

        service.getSnapshots(storageName).subscribe((asyncData) => {
            try {
                expect(asyncData).toStrictEqual([]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush([]);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getSnapshots should return a list of detailed snapshots', (done) => {
        const storageName = 'nextcloud.ifca.es';
        const url =
            `${base}/storage/` +
            storageName +
            `/ls?storage_name=` +
            storageName +
            `&vo=vo.ai4eosc.eu&subpath=ai4os-storage/tools/cvat/backups`;

        service.getSnapshots(storageName).subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(snapshotsListMock);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(snapshotsListMock);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });
});
