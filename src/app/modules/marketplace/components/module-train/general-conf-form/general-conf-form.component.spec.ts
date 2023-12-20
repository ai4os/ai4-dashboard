import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralConfFormComponent } from './general-conf-form.component';
import { SharedModule } from '@app/shared/shared.module';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from '@app/layout/sidenav/sidenav.component';
import { ModuleGeneralConfiguration } from '@app/shared/interfaces/module.interface';

const mockDefaultFormValues: ModuleGeneralConfiguration = {
    title: { name: '', value: '', description: '' },
    docker_image: { name: '', value: '', description: '' },
    docker_tag: { name: '', value: '', description: '' },
    service: { name: '', value: '', description: '' },
};

describe('GeneralConfFormComponent', () => {
    let component: GeneralConfFormComponent;
    let fixture: ComponentFixture<GeneralConfFormComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            declarations: [GeneralConfFormComponent, SidenavComponent],
            imports: [
                SharedModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
            ],
            providers: [
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralConfFormComponent);
        component = fixture.componentInstance;
        component.parentForm = new FormGroup({
            x: new FormControl(''),
        });
        component.defaultFormValues = mockDefaultFormValues;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('form invalid when empty', () => {
        expect(component.generalConfFormGroup.valid).toBeFalsy();
    });

    it('check jupyter valid config', () => {
        let serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('jupyter');
        let title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        let password =
            component.generalConfFormGroup.controls['serviceToRunPassInput'];
        password.setValue('123456789');
        expect(component.generalConfFormGroup.valid).toBeTruthy();
    });

    it('check jupyter invalid config', () => {
        let serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('jupyter');

        // check required restrictions
        expect(
            component.generalConfFormGroup.controls.titleInput.valid
        ).toBeFalsy();
        expect(
            component.generalConfFormGroup.controls.serviceToRunPassInput.valid
        ).toBeFalsy();

        let title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        let password =
            component.generalConfFormGroup.controls['serviceToRunPassInput'];
        password.setValue('123456');

        // check password length
        expect(component.generalConfFormGroup.valid).toBeFalsy();
    });

    it('check vscode valid config', () => {
        let serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('vscode');
        let title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        let password =
            component.generalConfFormGroup.controls['serviceToRunPassInput'];
        password.setValue('123456789');
        expect(component.generalConfFormGroup.valid).toBeTruthy();
    });

    it('check vscode invalid config', () => {
        let serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('vscode');

        // check required restrictions
        expect(
            component.generalConfFormGroup.controls.titleInput.valid
        ).toBeFalsy();
        expect(
            component.generalConfFormGroup.controls.serviceToRunPassInput.valid
        ).toBeFalsy();

        let title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        let password =
            component.generalConfFormGroup.controls['serviceToRunPassInput'];
        password.setValue('123456');

        // check password length
        expect(component.generalConfFormGroup.valid).toBeFalsy();
    });

    it('check fedserver valid config', () => {
        let serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('fedserver');
        let title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        expect(component.generalConfFormGroup.valid).toBeTruthy();
    });

    it('check fedserver invalid config', () => {
        let serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('fedserver');

        // check required restrictions
        expect(
            component.generalConfFormGroup.controls.titleInput.valid
        ).toBeFalsy();
    });
});
