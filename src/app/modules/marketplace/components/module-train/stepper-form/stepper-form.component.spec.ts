import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFormComponent } from './stepper-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { FormGroupDirective, FormBuilder, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('StepperFormComponent', () => {
    let component: StepperFormComponent;
    let fixture: ComponentFixture<StepperFormComponent>;

    beforeEach(async () => {
        const formGroupDirective = new FormGroupDirective([], []);
        await TestBed.configureTestingModule({
            declarations: [StepperFormComponent],
            imports: [
                SharedModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                RouterTestingModule,
            ],
            providers: [
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StepperFormComponent);
        component = fixture.componentInstance;
        component.step1Form = new FormGroup([]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
