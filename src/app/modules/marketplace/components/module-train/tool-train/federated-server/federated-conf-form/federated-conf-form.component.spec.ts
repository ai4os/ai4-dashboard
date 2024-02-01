import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FederatedConfFormComponent } from './federated-conf-form.component';
import { FormGroupDirective, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { defaultFormValuesMock } from './federated-conf-form.component.mock';
import { MediaMatcher } from '@angular/cdk/layout';

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

describe('FederatedConfFormComponent', () => {
    let component: FederatedConfFormComponent;
    let fixture: ComponentFixture<FederatedConfFormComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });
        await TestBed.configureTestingModule({
            declarations: [FederatedConfFormComponent],
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

        fixture = TestBed.createComponent(FederatedConfFormComponent);
        component = fixture.componentInstance;
        component.defaultFormValues = defaultFormValuesMock;
        component.showHelp = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('check valid config', () => {
        const roundsInput =
            component.federatedConfFormGroup.controls['roundsInput'];
        roundsInput.setValue('1');
        const minClientsInput =
            component.federatedConfFormGroup.controls['minClientsInput'];
        minClientsInput.setValue('1');

        expect(component.federatedConfFormGroup.valid).toBeTruthy();
    });

    it('check invalid config', () => {
        const roundsInput =
            component.federatedConfFormGroup.controls['roundsInput'];
        roundsInput.setValue('5');
        const minClientsInput =
            component.federatedConfFormGroup.controls['minClientsInput'];
        minClientsInput.setValue('5');

        expect(component.federatedConfFormGroup.valid).toBeFalsy();
    });
});
