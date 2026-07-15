import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';
import { testProviders } from '@app/shared/testing/test-providers';

describe('BarChartComponent', () => {
    let component: BarChartComponent;
    let fixture: ComponentFixture<BarChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BarChartComponent],
            providers: testProviders,
        }).compileComponents();

        fixture = TestBed.createComponent(BarChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
