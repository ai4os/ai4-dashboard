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
import { MediaMatcher } from '@angular/cdk/layout';

const mockDefaultFormValues: ModuleGeneralConfiguration = {
    title: { name: '', value: '', description: '' },
    docker_image: { name: '', value: '', description: '' },
    docker_tag: { name: '', value: '', description: '' },
    service: { name: '', value: '', description: '' },
};

const mockedMediaQueryList: MediaQueryList = {
    matches: true,
    media: 'test',
    onchange: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
};

const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
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
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
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
        ).toBeFalsy();
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
        ).toBeFalsy();
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

    it('check fedserver invalid config', () => {
        const serviceToRun =
            component.generalConfFormGroup.controls['serviceToRunChip'];
        serviceToRun.setValue('fedserver');

        // check required restrictions
        expect(
            component.generalConfFormGroup.controls.titleInput.valid
        ).toBeFalsy();
    });
});
