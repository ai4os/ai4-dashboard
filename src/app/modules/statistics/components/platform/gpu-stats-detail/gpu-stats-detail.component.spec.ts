import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpuStatsDetailComponent } from './gpu-stats-detail.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { testProviders } from '@testing/test-providers';

const gpuStats = [{ type: 'Tesla V4', value: { gpuUsed: 10, gpuTotal: 20 } }];

describe('GpuStatsDetailComponent', () => {
    let component: GpuStatsDetailComponent;
    let fixture: ComponentFixture<GpuStatsDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                GpuStatsDetailComponent,
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [
                ...testProviders,

                { provide: MAT_DIALOG_DATA, useValue: { gpuStats } },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(GpuStatsDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show canvas and ok button', () => {
        const canvas = fixture.debugElement.query(By.css('#canvas'));
        expect(canvas).toBeTruthy();

        const button = fixture.debugElement.query(By.css('#ok-button'));
        expect(button).toBeTruthy();
    });
});
