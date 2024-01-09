import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSeriesChartComponent } from './time-series-chart.component';

describe('TimeSeriesChartComponent', () => {
    let component: TimeSeriesChartComponent;
    let fixture: ComponentFixture<TimeSeriesChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimeSeriesChartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TimeSeriesChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
