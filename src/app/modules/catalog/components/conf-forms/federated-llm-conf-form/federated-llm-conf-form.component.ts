import { MediaMatcher } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { UiSelectComponent } from '@app/shared/components/ui/ui-select/ui-select.component';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import {
    FederatedServerLlmConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import { mockedRange, mockedString } from '@app/shared/mocks/conf-objects.mock';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-federated-llm-conf-form',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        UiSelectComponent,
        UiTextFieldComponent,
        TranslatePipe,
    ],
    templateUrl: './federated-llm-conf-form.component.html',
    styleUrl: './federated-llm-conf-form.component.scss',

    changeDetection: ChangeDetectionStrategy.Eager,
})
export class FederatedLlmConfFormComponent implements OnInit {
    ctrlContainer = inject(FormGroupDirective);
    fb = inject(FormBuilder);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);
    private readonly translate = inject(TranslateService);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    parentForm!: FormGroup;

    federatedLlmConfFormGroup = this.fb.group({
        roundsInput: [''],
        modelNameInput: [{ value: '', disabled: true }],
        modelQuantizationSelect: [''],
        numEpochsInput: [''],
        fractionTrainInput: [''],
        fractionEvaluateInput: [''],
    });

    protected _defaultFormValues: FederatedServerLlmConfiguration = {
        num_rounds: mockedRange,
        model_name: mockedString,
        model_quantization: mockedRange,
        num_epochs: mockedRange,
        fraction_train: mockedRange,
        fraction_evaluate: mockedRange,
    };

    protected _showHelp = false;

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

    @Input() set showHelp(showHelp: any) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: any) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;

            // --- Rounds ---
            this.federatedLlmConfFormGroup
                .get('roundsInput')
                ?.setValidators([
                    Validators.required,
                    Validators.min(defaultFormValues.num_rounds?.range?.[0]),
                    Validators.max(defaultFormValues.num_rounds?.range?.[1]),
                ]);
            this.federatedLlmConfFormGroup
                .get('roundsInput')
                ?.setValue(defaultFormValues.num_rounds?.value);

            // --- Model name ---
            this.federatedLlmConfFormGroup
                .get('modelNameInput')
                ?.setValue(defaultFormValues.model_name.value as string);

            // --- Model quantization ---
            this.federatedLlmConfFormGroup
                .get('modelQuantizationSelect')
                ?.setValidators([Validators.required]);
            this.federatedLlmConfFormGroup
                .get('modelQuantizationSelect')
                ?.setValue(defaultFormValues.model_quantization?.value);

            this.modelQuantizationOptions = [];
            defaultFormValues.model_quantization?.options?.forEach(
                (option: any) => {
                    this.modelQuantizationOptions.push({
                        value: option,
                        viewValue: option,
                    });
                }
            );

            // --- Num epochs ---
            this.federatedLlmConfFormGroup
                .get('numEpochsInput')
                ?.setValidators([
                    Validators.required,
                    Validators.min(defaultFormValues.num_epochs?.range?.[0]),
                    Validators.max(defaultFormValues.num_epochs?.range?.[1]),
                ]);
            this.federatedLlmConfFormGroup
                .get('numEpochsInput')
                ?.setValue(defaultFormValues.num_epochs?.value);

            // --- Fraction train ---
            this.federatedLlmConfFormGroup
                .get('fractionTrainInput')
                ?.setValidators([
                    Validators.required,
                    Validators.min(
                        defaultFormValues.fraction_train?.range?.[0]
                    ),
                    Validators.max(
                        defaultFormValues.fraction_train?.range?.[1]
                    ),
                ]);
            this.federatedLlmConfFormGroup
                .get('fractionTrainInput')
                ?.setValue(defaultFormValues.fraction_train?.value);

            // --- Fraction evaluate ---
            this.federatedLlmConfFormGroup
                .get('fractionEvaluateInput')
                ?.setValidators([
                    Validators.required,
                    Validators.min(
                        defaultFormValues.fraction_evaluate?.range?.[0]
                    ),
                    Validators.max(
                        defaultFormValues.fraction_evaluate?.range?.[1]
                    ),
                ]);
            this.federatedLlmConfFormGroup
                .get('fractionEvaluateInput')
                ?.setValue(defaultFormValues.fraction_evaluate?.value);

            this.federatedLlmConfFormGroup.updateValueAndValidity();
        }
    }

    modelQuantizationOptions: any[] = [];

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'federatedLlmConfForm',
            this.federatedLlmConfFormGroup
        );

        setTimeout(() => {
            this.parentForm.updateValueAndValidity();
        });
    }

    getPayload(): TrainModuleRequest['fed_llm_server'] {
        const v = this.federatedLlmConfFormGroup.getRawValue();

        return {
            num_rounds: Number(v.roundsInput),
            model_name: v.modelNameInput ?? '',
            model_quantization: Number(v.modelQuantizationSelect),
            num_epochs: Number(v.numEpochsInput),
            fraction_train: Number(v.fractionTrainInput),
            fraction_evaluate: Number(v.fractionEvaluateInput),
        };
    }
}
