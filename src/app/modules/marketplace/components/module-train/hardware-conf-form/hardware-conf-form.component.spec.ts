import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareConfFormComponent } from './hardware-conf-form.component';

describe('HardwareConfFormComponent', () => {
  let component: HardwareConfFormComponent;
  let fixture: ComponentFixture<HardwareConfFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HardwareConfFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HardwareConfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
