import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnapshotDetailComponent } from './snapshot-detail.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { Snapshot } from '@app/shared/interfaces/deployment.interface';
import { SharedModule } from '@app/shared/shared.module';

const mockedMediaQueryList: MediaQueryList = {
    matches: true,
    media: 'test',
    onchange: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
};
const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

const snapshotMock: Snapshot = {
    snapshot_ID: '1234',
    title: 'SnapshotTest',
    status: 'complete',
    submit_time: '2024-11-12 09:30:40',
    docker_image:
        'registry.services.ai4os.eu/user-snapshots/b965ce0bceb90d42b69d0767e2148c297e5f4a5d9db315432747e84a4ccebf0b_at_egi.eu',
    size: 2064652547,
    nomad_ID: '',
};

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
                    useValue: { snapshot: snapshotMock },
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
});
