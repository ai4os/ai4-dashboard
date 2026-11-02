import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { SnapshotDetailComponent } from './snapshot-detail.component';
import { SnapshotService } from '../../services/snapshots-service/snapshot.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedSnapshots } from '@app/modules/deployments/services/snapshots-service/snapshots.service.mock';
import { testProviders } from '@testing/test-providers';
import { of } from 'rxjs';

describe('SnapshotDetailComponent', () => {
    let component: SnapshotDetailComponent;
    let fixture: ComponentFixture<SnapshotDetailComponent>;
    let snapshotUuid: string;
    let getSnapshotByUUID: jest.Mock;
    let snackbarService: { openError: jest.Mock };

    beforeEach(async () => {
        TestBed.overrideComponent(SnapshotDetailComponent, {
            set: { template: '' },
        });

        snapshotUuid = '';
        snackbarService = { openError: jest.fn() };
        getSnapshotByUUID = jest
            .fn()
            .mockReturnValue(of({ ...mockedSnapshots[0] }));

        await TestBed.configureTestingModule({
            imports: [SnapshotDetailComponent],
            providers: [
                ...testProviders,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            data: {},
                            routeConfig: { path: 'snapshots/:uuid' },
                            paramMap: {
                                get: (name: string) =>
                                    name === 'uuid' ? snapshotUuid : null,
                            },
                        },
                        params: of({}),
                        data: of({}),
                        url: of([]),
                        queryParams: of({}),
                        children: [],
                    },
                },
                {
                    provide: SnapshotService,
                    useValue: { getSnapshotByUUID },
                },
                {
                    provide: SnackbarService,
                    useValue: snackbarService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SnapshotDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('does not request a snapshot when the route has no UUID', () => {
        expect(getSnapshotByUUID).not.toHaveBeenCalled();
        expect(component.snapshot).toBeUndefined();
    });

    it('loads the snapshot from the route and formats its displayed fields', () => {
        snapshotUuid = mockedSnapshots[0].snapshot_ID;
        component.ngOnInit();

        expect(getSnapshotByUUID).toHaveBeenCalledWith(snapshotUuid);
        expect(component.snapshot).toEqual(
            expect.objectContaining({
                ...mockedSnapshots[0],
                size: 1.92,
                description: '-',
            })
        );
        expect(component.statusBadge).not.toBe('');
        expect(component.isLoading).toBe(false);
    });

    it('marks a loaded snapshot with an error message as failed', () => {
        getSnapshotByUUID.mockReturnValue(
            of({ ...mockedSnapshots[0], error_msg: 'Snapshot failed' })
        );
        snapshotUuid = mockedSnapshots[0].snapshot_ID;

        component.ngOnInit();

        expect(component.snapshotHasError).toBe(true);
        expect(component.snapshot?.error_msg).toBe('Snapshot failed');
    });

    it('reports a missing snapshot and stops loading', () => {
        getSnapshotByUUID.mockReturnValue(of(undefined));
        snapshotUuid = 'missing-snapshot';

        component.ngOnInit();

        expect(snackbarService.openError).toHaveBeenCalledWith(
            "Couldn't find the requested snapshot."
        );
        expect(component.isLoading).toBe(false);
    });
});
