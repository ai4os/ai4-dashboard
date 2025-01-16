import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeModuleCardComponent } from './ai4life-module-card.component';

describe('Ai4lifeModuleCardComponent', () => {
  let component: Ai4lifeModuleCardComponent;
  let fixture: ComponentFixture<Ai4lifeModuleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ai4lifeModuleCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ai4lifeModuleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
