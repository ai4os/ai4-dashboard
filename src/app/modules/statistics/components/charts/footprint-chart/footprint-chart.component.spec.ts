import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintChartComponent } from './footprint-chart.component';
import { testProviders } from '@app/shared/testing/test-providers';

describe('FootprintChartComponent', () => {
    let component: FootprintChartComponent;
    let fixture: ComponentFixture<FootprintChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FootprintChartComponent],
            providers: testProviders,
        }).compileComponents();

        fixture = TestBed.createComponent(FootprintChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
