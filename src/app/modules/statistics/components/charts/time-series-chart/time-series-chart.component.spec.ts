import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSeriesChartComponent } from './time-series-chart.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { By } from '@angular/platform-browser';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { testProviders } from '@app/shared/testing/test-providers';

describe('TimeSeriesChartComponent', () => {
    let component: TimeSeriesChartComponent;
    let fixture: ComponentFixture<TimeSeriesChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TimeSeriesChartComponent],
            providers: [
                ...testProviders,
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TimeSeriesChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('shows chart', () => {
        const chart = fixture.debugElement.query(By.css('#chart'));
        expect(chart).toBeTruthy();
    });
});
