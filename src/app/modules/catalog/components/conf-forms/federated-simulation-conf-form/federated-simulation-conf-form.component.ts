import { MediaMatcher } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { UiSelectComponent } from '@app/shared/components/ui/ui-select/ui-select.component';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import {
    FederatedSimulationLlmConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import {
    mockedOptions,
    mockedRange,
    mockedString,
} from '@app/shared/mocks/conf-objects.mock';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { ServicesCredentialsStore } from '@app/modules/profile/store/services-credentials.store';
import { filePathValidator } from '@app/shared/utils/validators';

@Component({
    selector: 'app-federated-simulation-conf-form',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        UiSelectComponent,
        UiTextFieldComponent,
        TranslatePipe,
        UiButtonComponent,
    ],
    templateUrl: './federated-simulation-conf-form.component.html',
    styleUrl: './federated-simulation-conf-form.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class FederatedSimulationConfFormComponent implements OnInit {
    store = inject(ServicesCredentialsStore);

    ctrlContainer = inject(FormGroupDirective);
    fb = inject(FormBuilder);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);
    private readonly translate = inject(TranslateService);

    protected readonly hfTokenErrors = {
        required: 'CATALOG.CONF-FORMS.LLMS.HUGGING-FACE-TOKEN-REQUIRED',
    };

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);

        // To retrieve HF token from store
        effect(() => {
            const storeToken = this.store.hfToken();
            console.log(storeToken);
            const defaultToken =
                (this._defaultFormValues?.hf_token?.value as string) ?? '';

            const resolvedToken =
                storeToken.trim() !== '' ? storeToken : defaultToken;

            this.federatedLlmConfFormGroup
                .get('huggingFaceTokenInput')
                ?.setValue(resolvedToken);
        });
    }

    parentForm!: FormGroup;

    federatedLlmConfFormGroup = this.fb.group({
        dataFileNameInput: ['', [Validators.required, filePathValidator()]],
        modelNameInput: [{ value: '', disabled: true }],
        huggingFaceTokenInput: ['', Validators.required],
        strategyOptionsSelect: [''],
        roundsInput: [''],
        modelQuantizationSelect: [''],
    });

    protected _defaultFormValues: FederatedSimulationLlmConfiguration = {
        data_file_name: mockedString,
        model_name: mockedString,
        hf_token: mockedString,
        strategy: mockedOptions,
        num_rounds: mockedRange,
        model_quantization: mockedRange,
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

            // --- Data file name ---
            this.federatedLlmConfFormGroup
                .get('dataFileNameInput')
                ?.setValue(defaultFormValues.data_file_name.value as string);

            // --- Model name ---
            this.federatedLlmConfFormGroup
                .get('modelNameInput')
                ?.setValue(defaultFormValues.model_name.value as string);

            // --- HF token ---
            const storeToken = this.store.hfToken();
            const tokenValue =
                storeToken.trim() !== ''
                    ? storeToken
                    : (defaultFormValues.hf_token?.value ?? '');

            this.federatedLlmConfFormGroup
                .get('huggingFaceTokenInput')
                ?.setValue(tokenValue);

            // --- Strategies ---
            this.federatedLlmConfFormGroup
                .get('strategyOptionsSelect')
                ?.setValidators([Validators.required]);
            this.federatedLlmConfFormGroup
                .get('strategyOptionsSelect')
                ?.setValue(defaultFormValues.strategy?.value);

            this.strategyOptions = [];
            defaultFormValues.strategy?.options?.forEach((option: any) => {
                this.strategyOptions.push({ value: option, viewValue: option });
            });

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

            this.federatedLlmConfFormGroup.updateValueAndValidity();
        }
    }

    strategyOptions: any = [];
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

        // To retrieve HF token from store
        this.store.ensureLoaded();
    }

    getPayload(): TrainModuleRequest['fed_llm_simulation'] {
        const v = this.federatedLlmConfFormGroup.getRawValue();

        return {
            data_file_name: v.dataFileNameInput ?? '',
            model_name: v.modelNameInput ?? '',
            hf_token: v.huggingFaceTokenInput ?? '',
            strategy: v.strategyOptionsSelect ?? '',
            num_rounds: Number(v.roundsInput),
            model_quantization: Number(v.modelQuantizationSelect),
        };
    }
}
