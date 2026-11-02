import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralConfFormComponent } from './general-conf-form.component';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { SidenavComponent } from '@app/layout/sidenav/sidenav.component';
import { ModuleGeneralConfiguration } from '@app/shared/interfaces/module.interface';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedVllmsConfig } from '@app/modules/catalog/services/tools-service/tools-service.mock';
import { testProviders } from '@testing/test-providers';

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
            imports: [
                GeneralConfFormComponent,
                SidenavComponent,
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [
                ...testProviders,
                FormGroupDirective,
                FormBuilder,
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: FormGroupDirective, useValue: formGroupDirective },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralConfFormComponent);
        component = fixture.componentInstance;
        component.defaultFormValues = mockDefaultFormValues;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('form valid when empty', () => {
        expect(component.generalConfFormGroup.valid).toBeTruthy();
    });

    it('check jupyter valid config', () => {
        const serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('jupyter');
        const title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        const password =
            component.generalConfFormGroup.controls['serviceToRunPassInput'];
        password.setValue('123456789');
        expect(component.generalConfFormGroup.valid).toBeTruthy();
    });

    it('check jupyter invalid config', () => {
        const serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('jupyter');

        // check required restrictions
        expect(
            component.generalConfFormGroup.controls.titleInput.valid
        ).toBeTruthy();
        expect(
            component.generalConfFormGroup.controls.serviceToRunPassInput.valid
        ).toBeFalsy();

        const title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        const password =
            component.generalConfFormGroup.controls['serviceToRunPassInput'];
        password.setValue('123456');

        // check password length
        expect(component.generalConfFormGroup.valid).toBeFalsy();
    });

    it('check vscode valid config', () => {
        const serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('vscode');
        const title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        const password =
            component.generalConfFormGroup.controls['serviceToRunPassInput'];
        password.setValue('123456789');
        expect(component.generalConfFormGroup.valid).toBeTruthy();
    });

    it('check vscode invalid config', () => {
        const serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('vscode');

        // check required restrictions
        expect(
            component.generalConfFormGroup.controls.titleInput.valid
        ).toBeTruthy();
        expect(
            component.generalConfFormGroup.controls.serviceToRunPassInput.valid
        ).toBeFalsy();

        const title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        const password =
            component.generalConfFormGroup.controls['serviceToRunPassInput'];
        password.setValue('123456');

        // check password length
        expect(component.generalConfFormGroup.valid).toBeFalsy();
    });

    it('check fedserver valid config', () => {
        const serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('fedserver');
        const title = component.generalConfFormGroup.controls['titleInput'];
        title.setValue('test');
        expect(component.generalConfFormGroup.valid).toBeTruthy();
    });

    it('check fedserver valid config', () => {
        const serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('fedserver');

        // check required restrictions
        expect(
            component.generalConfFormGroup.controls.titleInput.valid
        ).toBeTruthy();
    });

    it('should enable password field when service is jupyter or vscode', () => {
        const passwordControl = component.generalConfFormGroup.get(
            'serviceToRunPassInput'
        );

        // set value to jupyter
        component.generalConfFormGroup
            .get('serviceToRunChip')
            ?.setValue('jupyter');
        expect(passwordControl?.enabled).toBe(true);

        // set value to vscode
        component.generalConfFormGroup
            .get('serviceToRunChip')
            ?.setValue('vscode');
        expect(passwordControl?.enabled).toBe(true);

        // set value to something else
        component.generalConfFormGroup
            .get('serviceToRunChip')
            ?.setValue('deepaas');
        expect(passwordControl?.disabled).toBe(true);
    });
});
