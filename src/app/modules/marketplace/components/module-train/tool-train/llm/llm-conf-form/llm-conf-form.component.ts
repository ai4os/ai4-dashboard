import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import {
    LlmConfiguration,
    confObjectRange,
} from '@app/shared/interfaces/module.interface';

export interface showLlmField {
    gpu_memory_utilization: boolean;
    max_model_length: boolean;
    tensor_parallel_size: boolean;
    huggingface_token: boolean;
    modelname: boolean;
}

const mockedConfObject: confObjectRange = {
    range: [],
    name: '',
    value: '',
    description: '',
};

@Component({
    selector: 'app-llm-conf-form',
    templateUrl: './llm-conf-form.component.html',
    styleUrl: './llm-conf-form.component.scss',
})
export class LlmConfFormComponent {
    constructor(
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    _showFields = {
        gpu_memory_utilization: true,
        max_model_length: true,
        tensor_parallel_size: true,
        huggingface_token: true,
        modelname: true,
    };

    @Input() set showFields(showFields: showLlmField) {
        this._showFields = showFields;
    }
    parentForm!: FormGroup;

    protected _defaultFormValues: LlmConfiguration = {
        gpu_memory_utilization: mockedConfObject,
        max_model_length: mockedConfObject,
        tensor_parallel_size: mockedConfObject,
        huggingface_token: mockedConfObject,
        modelname: mockedConfObject,
    };

    llmConfFormGroup = this.fb.group({
        gpuMemUtilizationInput: [
            0,
            [
                Validators.min(
                    this.defaultFormValues?.gpu_memory_utilization.range[0]
                ),
                Validators.max(
                    this.defaultFormValues?.gpu_memory_utilization.range[1]
                ),
            ],
        ],
        maxModelLenInput: [0],
        tensorParallelSizeInput: [0],
        huggingFaceTokenInput: [''],
        vllmModelSelect: [''],
    });

    vllmModelOptions: any = [];

    protected _showHelp = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: LlmConfiguration) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.llmConfFormGroup
                .get('gpuMemUtilizationInput')
                ?.setValue(
                    defaultFormValues.gpu_memory_utilization.value as number
                );
            this.llmConfFormGroup
                .get('maxModelLenInput')
                ?.setValue(defaultFormValues.max_model_length?.value as number);
            this.llmConfFormGroup
                .get('tensorParallelSizeInput')
                ?.setValue(
                    defaultFormValues.tensor_parallel_size.value as number
                );
            this.llmConfFormGroup
                .get('huggingFaceTokenInput')
                ?.setValue(defaultFormValues.huggingface_token.value as string);
            this.llmConfFormGroup
                .get('vllmModelSelect')
                ?.setValue(defaultFormValues.modelname.value as string);
            defaultFormValues.modelname?.options?.forEach((option: any) => {
                this.vllmModelOptions.push({
                    value: option,
                    viewValue: option,
                });
            });
        }
    }

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl('llmConfForm', this.llmConfFormGroup);
    }
}
