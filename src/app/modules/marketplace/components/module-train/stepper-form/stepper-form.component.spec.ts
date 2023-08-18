import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFormComponent } from './stepper-form.component';

describe('StepperFormComponent', () => {
  let component: StepperFormComponent;
  let fixture: ComponentFixture<StepperFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
