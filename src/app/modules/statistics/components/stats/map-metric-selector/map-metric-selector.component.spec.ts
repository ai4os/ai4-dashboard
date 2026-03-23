import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMetricSelectorComponent } from './map-metric-selector.component';

describe('MapMetricSelectorComponent', () => {
    let component: MapMetricSelectorComponent;
    let fixture: ComponentFixture<MapMetricSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MapMetricSelectorComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapMetricSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
