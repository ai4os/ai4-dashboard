import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintChartComponent } from './footprint-chart.component';

describe('FootprintChartComponent', () => {
    let component: FootprintChartComponent;
    let fixture: ComponentFixture<FootprintChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FootprintChartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FootprintChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
