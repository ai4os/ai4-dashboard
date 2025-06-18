import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FederatedConfFormComponent } from './federated-conf-form.component';
import { FormGroupDirective, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { flowerDefaultFormValues } from './federated-conf-form.component.mock';
import { MediaMatcher } from '@angular/cdk/layout';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

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
        component.defaultFormValues = flowerDefaultFormValues;
        component.showHelp = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form and add control to parent form', () => {
        expect(component.parentForm.contains('federatedConfForm')).toBe(true);
    });

    it('should validate valid form configuration', () => {
        component.federatedConfFormGroup.patchValue({
            roundsInput: '1',
            minFitClientsInput: '2',
            minAvailableClientsInput: '2',
        });
        expect(component.federatedConfFormGroup.valid).toBe(true);
    });

    it('should invalidate incorrect form configuration', () => {
        component.federatedConfFormGroup.patchValue({
            roundsInput: '5',
            minFitClientsInput: '1',
            minAvailableClientsInput: '1',
        });
        expect(component.federatedConfFormGroup.valid).toBe(false);
    });

    it('should show strategy info for valid strategy', () => {
        component.federatedConfFormGroup
            .get('strategyOptionsSelect')
            ?.setValue('Adaptive Federated Optimization (FedOpt)');
        component.checkStrategy();
        expect(component['showStrategiesInfo']).toBe(true);
    });

    it('should hide strategy info for invalid strategy', () => {
        component.federatedConfFormGroup
            .get('strategyOptionsSelect')
            ?.setValue('Unknown strategy');
        component.checkStrategy();
        expect(component['showStrategiesInfo']).toBe(false);
    });

    it('should add a metric from chip input', () => {
        const chipInputClear = jest.fn();
        const event: MatChipInputEvent = {
            input: { value: 'custom' } as any,
            value: 'custom',
            chipInput: { clear: chipInputClear } as any,
        };
        component.add(event);
        expect(component.metrics).toContain('custom');
        expect(chipInputClear).toHaveBeenCalled();
    });

    it('should not add duplicate metric', () => {
        component.metrics = ['accuracy'];
        const chipInputClear = jest.fn();
        const event: MatChipInputEvent = {
            input: { value: 'accuracy' } as any,
            value: 'accuracy',
            chipInput: { clear: chipInputClear } as any,
        };
        component.add(event);
        expect(component.metrics).toHaveLength(1);
    });

    it('should remove a metric', () => {
        component.metrics = ['accuracy', 'custom'];
        component.remove('custom');
        expect(component.metrics).not.toContain('custom');
    });

    it('should add metric from autocomplete selection', () => {
        const event: MatAutocompleteSelectedEvent = {
            option: { viewValue: 'rmse' },
        } as any;
        component.selected(event);
        expect(component.metrics).toContain('rmse');
    });

    it('should open differential privacy docs in new tab', () => {
        const openSpy = jest
            .spyOn(window, 'open')
            .mockImplementation(() => null);
        component.openDifferentialPrivacyDocs();
        expect(openSpy).toHaveBeenCalledWith(
            'https://docs.ai4os.eu/en/latest/howtos/train/federated-flower.html#server-side-differential-privacy'
        );
        openSpy.mockRestore();
    });

    it('should open metric privacy docs in new tab', () => {
        const openSpy = jest
            .spyOn(window, 'open')
            .mockImplementation(() => null);
        component.openMetricPrivacyDocs();
        expect(openSpy).toHaveBeenCalledWith(
            'https://docs.ai4os.eu/en/latest/howtos/train/federated-flower.html#server-side-metric-privacy'
        );
        openSpy.mockRestore();
    });
});
