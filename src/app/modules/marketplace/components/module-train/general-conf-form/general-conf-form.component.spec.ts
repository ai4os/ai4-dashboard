import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralConfFormComponent } from './general-conf-form.component';
import { SharedModule } from '@app/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GeneralConfFormComponent', () => {
  let component: GeneralConfFormComponent;
  let fixture: ComponentFixture<GeneralConfFormComponent>;

  beforeEach(async () => {
    const fb = new FormBuilder()
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
      test: fb.control(null)
    });

    await TestBed.configureTestingModule({
      declarations: [ GeneralConfFormComponent ],
      imports: [
        SharedModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [ 
        FormGroupDirective,
        FormBuilder,
        {provide: FormGroupDirective, useValue: formGroupDirective}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralConfFormComponent);
    component = fixture.componentInstance;
    component.parentForm = new FormGroup({
      x: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
