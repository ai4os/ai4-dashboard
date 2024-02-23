import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpuStatsDetailComponent } from './gpu-stats-detail.component';

describe('GpuStatsDetailComponent', () => {
  let component: GpuStatsDetailComponent;
  let fixture: ComponentFixture<GpuStatsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpuStatsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpuStatsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
