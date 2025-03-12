import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    LlmConfiguration,
    VllmModelConfig,
    confObjectRange,
} from '@app/shared/interfaces/module.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

export interface showLlmField {
    type: boolean;
    model_id: boolean;
    ui_password: boolean;
    HF_token: boolean;
    openai_api_key: boolean;
    openai_api_url: boolean;
}

const mockedConfObject: confObjectRange = {
    range: [],
    name: '',
    value: '',
    description: '',
};

export function urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const urlPattern =
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i;
        const value = control.value;
        const validURL = urlPattern.test(value);
        return validURL ? null : { invalidURL: true };
    };
}

@Component({
    selector: 'app-llm-conf-form',
    templateUrl: './llm-conf-form.component.html',
    styleUrl: './llm-conf-form.component.scss',
})
export class LlmConfFormComponent {
    constructor(
        private readonly authService: AuthService,
        private toolsService: ToolsService,
        private snackbarService: SnackbarService,
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
        type: true,
        model_id: true,
        ui_password: true,
        HF_token: true,
        openai_api_key: true,
        openai_api_url: true,
    };

    @Input() set showFields(showFields: showLlmField) {
        this._showFields = showFields;
    }

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: LlmConfiguration) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.llmConfFormGroup
                .get('deploymentTypeSelect')
                ?.setValue(defaultFormValues.type.value as string);
            defaultFormValues.type?.options?.forEach((type: string) => {
                this.deploymentTypeOptions.push({
                    value: type,
                    viewValue: type,
                });
            });
            this.llmConfFormGroup
                .get('vllmModelSelect')
                ?.setValue(defaultFormValues.model_id.value as string);
            defaultFormValues.model_id?.options?.forEach((option: any) => {
                this.vllmModelOptions.push({
                    value: option,
                    viewValue: option,
                });
            });
            this.llmConfFormGroup
                .get('uiPasswordInput')
                ?.setValue(defaultFormValues.ui_password.value as string);
            this.llmConfFormGroup
                .get('huggingFaceTokenInput')
                ?.setValue(defaultFormValues.HF_token.value as string);
            this.llmConfFormGroup
                .get('openaiApiKeyInput')
                ?.setValue(defaultFormValues.openai_api_key.value as string);
            this.llmConfFormGroup
                .get('openaiApiUrlInput')
                ?.setValue(defaultFormValues.openai_api_url.value as string);

            this.authService.userProfileSubject.subscribe((profile) => {
                const email = profile.email;
                this.llmConfFormGroup.get('uiUsernameInput')?.setValue(email);
            });
        }
    }

    protected _defaultFormValues: LlmConfiguration = {
        type: mockedConfObject,
        model_id: mockedConfObject,
        ui_password: mockedConfObject,
        HF_token: mockedConfObject,
        openai_api_key: mockedConfObject,
        openai_api_url: mockedConfObject,
    };

    parentForm!: FormGroup;
    vllmModelOptions: any = [];
    deploymentTypeOptions: { value: string; viewValue: string }[] = [];
    vllModelsConfigurations: VllmModelConfig[] = [];

    modelNeedsToken = false;
    hideUiPassword = true;

    llmConfFormGroup = this.fb.group({
        deploymentTypeSelect: ['', Validators.required],
        vllmModelSelect: ['', Validators.required],
        uiPasswordInput: ['', Validators.required],
        uiUsernameInput: [{ value: '', disabled: true }, Validators.required],
        huggingFaceTokenInput: [
            { value: '', disabled: true },
            Validators.required,
        ],
        openaiApiKeyInput: ['', Validators.required],
        openaiApiUrlInput: ['', [Validators.required, urlValidator()]],
    });

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    protected _showHelp = false;

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl('llmConfForm', this.llmConfFormGroup);
        this.getModelsConfig();
        this.setupValidationLogic();
    }

    getModelsConfig() {
        this.toolsService.getVllmModelConfiguration().subscribe({
            next: (config: VllmModelConfig[]) => {
                this.vllModelsConfigurations = config;
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve model configuration. Please try again later."
                );
            },
        });
    }

    modelChanged() {
        const model = this.llmConfFormGroup.get('vllmModelSelect')?.value;
        this.modelNeedsToken =
            this.vllModelsConfigurations.find((m) => m.name === model)
                ?.needs_HF_token ?? false;
        if (this.modelNeedsToken) {
            this.llmConfFormGroup.get('huggingFaceTokenInput')?.enable();
        } else {
            this.llmConfFormGroup.get('huggingFaceTokenInput')?.disable();
        }
    }

    private setupValidationLogic() {
        this.llmConfFormGroup
            .get('deploymentTypeSelect')!
            .valueChanges.subscribe((value) => {
                if (value === 'vllm') {
                    this.enableFields(['vllmModelSelect']);
                    this.disableFields([
                        'uiPasswordInput',
                        'openaiApiKeyInput',
                        'openaiApiUrlInput',
                    ]);
                } else if (value === 'open-webui') {
                    this.enableFields([
                        'uiPasswordInput',
                        'openaiApiKeyInput',
                        'openaiApiUrlInput',
                    ]);
                    this.disableFields(['vllmModelSelect']);
                } else if (value === 'both') {
                    this.enableFields(['vllmModelSelect', 'uiPasswordInput']);
                    this.disableFields([
                        'openaiApiKeyInput',
                        'openaiApiUrlInput',
                    ]);
                }
            });
    }

    private enableFields(fields: string[]) {
        fields.forEach((field) => {
            this.llmConfFormGroup.get(field)?.enable();
        });
    }

    private disableFields(fields: string[]) {
        fields.forEach((field) => {
            this.llmConfFormGroup.get(field)?.disable();
        });
    }
}
