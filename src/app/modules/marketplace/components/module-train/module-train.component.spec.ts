import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTrainComponent } from './module-train.component';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ModuleTrainComponent', () => {
  let component: ModuleTrainComponent;
  let fixture: ComponentFixture<ModuleTrainComponent>;
  const mockedConfigService: any = {}

  beforeEach(async () => {
    const fb = new FormBuilder()
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
      test: fb.control(null)
    });

    await TestBed.configureTestingModule({
      declarations: [ ModuleTrainComponent ],
      imports: [
        SharedModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ 
        FormGroupDirective,
        FormBuilder,
        {provide: FormGroupDirective, useValue: formGroupDirective},
        {provide: AppConfigService, useValue: mockedConfigService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
