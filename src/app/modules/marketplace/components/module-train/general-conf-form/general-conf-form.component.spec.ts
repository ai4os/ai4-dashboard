import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralConfFormComponent } from './general-conf-form.component';

describe('GeneralConfFormComponent', () => {
  let component: GeneralConfFormComponent;
  let fixture: ComponentFixture<GeneralConfFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralConfFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralConfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
