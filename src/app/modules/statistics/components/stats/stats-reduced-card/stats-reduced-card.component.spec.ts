import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsReducedCardComponent } from './stats-reduced-card.component';

describe('StatsReducedCardComponent', () => {
  let component: StatsReducedCardComponent;
  let fixture: ComponentFixture<StatsReducedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatsReducedCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsReducedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
