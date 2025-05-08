import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnapshotDetailComponent } from './snapshot-detail.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedSnapshots } from '@app/shared/mocks/snapshots.service.mock';

describe('SnapshotDetailComponent', () => {
    let component: SnapshotDetailComponent;
    let fixture: ComponentFixture<SnapshotDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SnapshotDetailComponent],
            imports: [SharedModule, TranslateModule.forRoot()],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: { snapshot: mockedSnapshots[0] },
                },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SnapshotDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize snapshot from data and set statusBadge', () => {
        expect(component.snapshot).toEqual(
            expect.objectContaining(mockedSnapshots[0])
        );
        expect(component.statusBadge).toBeDefined();
        expect(typeof component.statusBadge).toBe('string');
    });

    it('should detect error if error_msg is present', () => {
        component.data.snapshot.error_msg = 'Error message';
        component.ngOnInit();
        expect(component['snapshotHasError']).toBe(true);
    });
});
