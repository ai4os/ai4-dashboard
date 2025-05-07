import { TestBed } from '@angular/core/testing';

import { SnapshotService } from './snapshot.service';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { environment } from '@environments/environment';
import {
    mockedSnapshotDeleteResponse,
    mockedSnapshotCreateResponse,
    mockedSnapshots,
} from '@app/shared/mocks/snapshots.service.mock';

const { base } = environment.api;

describe('SnapshotService', () => {
    let service: SnapshotService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(SnapshotService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('createSnapshot should create a snapshot', (done) => {
        const deploymentUUID = '1234-5678';
        const expectedUrl = `${base}/snapshots`;
        const expectedVoParam = 'vo.ai4eosc.eu';

        service.createSnapshot(deploymentUUID).subscribe((response) => {
            try {
                expect(response).toEqual(mockedSnapshotCreateResponse);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'POST' &&
                r.url === expectedUrl &&
                r.params.get('vo') === expectedVoParam &&
                r.params.get('deployment_uuid') === deploymentUUID
        );

        req.flush(mockedSnapshotCreateResponse);
    });

    it('getSnapshots should return a list of snapshots', (done) => {
        const expectedUrl = `${base}/snapshots`;
        const expectedVoParam = 'vo.ai4eosc.eu';

        service.getSnapshots().subscribe((snapshots) => {
            try {
                expect(snapshots).toEqual(mockedSnapshots);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('vos') === expectedVoParam
        );

        req.flush(mockedSnapshots);
    });

    it('deleteSnapshotByUUID should delete a snapshot by UUID', (done) => {
        const snapshotUUID = 'snapshot1234';
        const expectedUrl = `${base}/snapshots`;
        const expectedVoParam = 'vo.ai4eosc.eu';

        service.deleteSnapshotByUUID(snapshotUUID).subscribe((response) => {
            try {
                expect(response).toEqual(mockedSnapshotDeleteResponse);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'DELETE' &&
                r.url === expectedUrl &&
                r.params.get('vo') === expectedVoParam &&
                r.params.get('snapshot_uuid') === snapshotUUID
        );

        req.flush(mockedSnapshotDeleteResponse);
    });
});
