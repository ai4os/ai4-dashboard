import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMetricLegendComponent } from './map-metric-legend.component';

describe('MapMetricLegendComponent', () => {
  let component: MapMetricLegendComponent;
  let fixture: ComponentFixture<MapMetricLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapMetricLegendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapMetricLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
