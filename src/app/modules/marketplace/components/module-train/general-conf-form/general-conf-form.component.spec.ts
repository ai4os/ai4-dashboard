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
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '@app/core/services/auth/auth.service';
import { of } from 'rxjs';

const mockDefaultFormValues: ModuleGeneralConfiguration = {
    title: { name: '', value: '', description: '' },
    docker_image: { name: '', value: '', description: '' },
    docker_tag: { name: '', value: '', description: '' },
    service: { name: '', value: '', description: '' },
};

const mockedProfile = {
    info: {
        exp: 1693908513,
        iat: 1693907913,
        auth_time: 1693907911,
        jti: '00000000-c9e1-44b7-b313-4bde8fba70fa',
        iss: 'https://aai-demo.egi.eu/auth/realms/egi',
        aud: 'ai4eosc-dashboard',
        sub: 'test@egi.eu',
        typ: 'ID',
        azp: 'ai4eosc-dashboard',
        nonce: 'WnVHR3ZpOVoyVlFwcjVGTEtIRWhyUTZ0eXJYVHZxN1M4TX5MRzVKWVJYVHZx',
        session_state: '00000000-818c-46d4-ad87-1b9a1c22c43f',
        at_hash: 'gdEA9VsgdEA9V-mubWhBWw',
        sid: 'b27a9b7a-818c-46d4-ad87-1b9a1818c43f',
        voperson_verified_email: ['test@ifca.unican.es'],
        email_verified: true,
        name: 'AI4EOSC Dasboard Test',
        preferred_username: 'ai4dash',
        eduperson_assurance: [
            'https://refeds.org/assurance/IAP/low',
            'https://aai.egi.eu/LoA#Low',
        ],
        given_name: 'AI4EOSC Dasboard ',
        family_name: 'Test',
        email: 'test@ifca.unican.es',
        eduperson_entitlement: [
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=vm_operator#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=vm_operator#aai.egi.eu',
        ],
    },
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

const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
    userProfileSubject: of({}),
    loadUserProfile: jest.fn().mockReturnValue(Promise.resolve(mockedProfile)),
    login: jest.fn(),
    logout: jest.fn(),
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
                provideHttpClient(),
                FormGroupDirective,
                FormBuilder,
                { provide: AuthService, useValue: mockedAuthService },
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
});
