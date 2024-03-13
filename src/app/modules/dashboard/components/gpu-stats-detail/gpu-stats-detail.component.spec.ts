import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpuStatsDetailComponent } from './gpu-stats-detail.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';

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

const gpuStats = [{ type: 'Tesla V4', value: { gpuUsed: 10, gpuTotal: 20 } }];

describe('GpuStatsDetailComponent', () => {
    let component: GpuStatsDetailComponent;
    let fixture: ComponentFixture<GpuStatsDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GpuStatsDetailComponent],
            imports: [SharedModule, TranslateModule.forRoot()],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { gpuStats } },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GpuStatsDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
