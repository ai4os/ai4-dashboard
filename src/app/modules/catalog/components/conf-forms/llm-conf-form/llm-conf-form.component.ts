import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ChangeDetectionStrategy,
    inject,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { SecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service';
import {
    LlmConfiguration,
    VllmModelConfig,
} from '@app/shared/interfaces/module.interface';
import { emailValidator, urlValidator } from '@app/shared/utils/validators';
import { UiSelectComponent } from '@app/shared/components/ui/ui-select/ui-select.component';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { TranslatePipe } from '@ngx-translate/core';

interface SelectOption {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'app-llm-conf-form',
    templateUrl: './llm-conf-form.component.html',
    styleUrls: ['./llm-conf-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        UiSelectComponent,
        UiTextFieldComponent,
        UiButtonComponent,
        TranslatePipe,
    ],
})
export class LlmConfFormComponent implements OnInit, OnChanges {
    private readonly authService = inject(AuthService);
    private readonly toolsService = inject(ToolsService);
    private readonly snackbarService = inject(SnackbarService);
    private readonly secretsService = inject(SecretsService);
    private readonly ctrlContainer = inject(FormGroupDirective);
    private readonly fb = inject(FormBuilder);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly media = inject(MediaMatcher);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
        this.authService.loadUserProfile();
    }

    parentForm!: FormGroup;

    protected _defaultFormValues!: LlmConfiguration;
    protected _showHelp = false;
    private _isLoading = false;

    @Output() isLoadingChange = new EventEmitter<boolean>();

    private setLoading(value: boolean): void {
        this._isLoading = value;
        this.isLoadingChange.emit(value);
    }

    deploymentTypeOptions: SelectOption[] = [];
    vllmModelOptions: SelectOption[] = [];
    private vllModelsConfigurations: VllmModelConfig[] = [];

    modelNeedsToken = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    protected readonly deploymentTypeErrors = {
        required: 'CATALOG.CONF-FORMS.LLMS.TYPE-REQUIRED',
    };
    protected readonly vllmModelErrors = {
        required: 'CATALOG.CONF-FORMS.LLMS.VLLM-MODEL-REQUIRED',
    };
    protected readonly uiUsernameErrors = {
        required: 'CATALOG.CONF-FORMS.LLMS.USERNAME-REQUIRED',
        invalidEmail: 'CATALOG.CONF-FORMS.LLMS.USERNAME-INVALID',
    };
    protected readonly uiPasswordErrors = {
        required: 'CATALOG.CONF-FORMS.LLMS.PASSWORD-REQUIRED',
    };
    protected readonly openaiApiUrlErrors = {
        required: 'CATALOG.CONF-FORMS.LLMS.API-URL-REQUIRED',
        invalidURL: 'CCATALOG.CONF-FORMS.LLMS.API-URL-FORMAT',
    };
    protected readonly openaiApiKeyErrors = {
        required: 'CATALOG.CONF-FORMS.LLMS.API-KEY-REQUIRED',
    };
    protected readonly hfTokenErrors = {
        required: 'CATALOG.CONF-FORMS.LLMS.HUGGING-FACE-TOKEN-REQUIRED',
    };

    /**
     * Model id preselected by the caller (e.g. navigated here from an LLM
     * catalog card with a specific model already chosen). Takes precedence
     * over the default model id returned by the configuration endpoint.
     */
    @Input() modelId?: string;
    @Input() defaultFormValues!: LlmConfiguration;

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    llmConfFormGroup = this.fb.group({
        deploymentTypeSelect: ['', Validators.required],
        vllmModelSelect: ['', Validators.required],
        uiUsernameInput: ['', [Validators.required, emailValidator()]],
        uiPasswordInput: ['', Validators.required],
        huggingFaceTokenInput: [
            { value: '', disabled: true },
            Validators.required,
        ],
        openaiApiKeyInput: [{ value: '', disabled: true }, Validators.required],
        openaiApiUrlInput: [
            { value: '', disabled: true },
            [Validators.required, urlValidator()],
        ],
    });

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl('llmConfForm', this.llmConfFormGroup);

        this.getModelsConfig();
        this.setupValidationLogic();

        this.authService.userProfile$.subscribe((profile) => {
            if (profile) {
                this.llmConfFormGroup
                    .get('uiUsernameInput')
                    ?.setValue(profile.email);
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['defaultFormValues'] && this.defaultFormValues) {
            this._defaultFormValues = this.defaultFormValues;

            this.deploymentTypeOptions = (
                this.defaultFormValues.type?.options ?? []
            ).map((type) => ({ value: type, viewValue: type }));

            this.llmConfFormGroup
                .get('deploymentTypeSelect')
                ?.setValue(this.defaultFormValues.type?.value as string);

            this.vllmModelOptions = (
                this.defaultFormValues.vllm_model_id?.options ?? []
            ).map((option) => ({ value: option, viewValue: option }));

            this.llmConfFormGroup
                .get('vllmModelSelect')
                ?.setValue(
                    this.modelId ??
                        (this.defaultFormValues.vllm_model_id?.value as string)
                );
            this.modelChanged();

            this.llmConfFormGroup
                .get('uiPasswordInput')
                ?.setValue(this.defaultFormValues.ui_password?.value as string);
            this.llmConfFormGroup
                .get('openaiApiKeyInput')
                ?.setValue(
                    this.defaultFormValues.openai_api_key?.value as string
                );
            this.llmConfFormGroup
                .get('openaiApiUrlInput')
                ?.setValue(
                    this.defaultFormValues.openai_api_url?.value as string
                );

            const hfToken = localStorage.getItem('hf_access_token') ?? '';
            if (hfToken === '') {
                this.getHFToken();
            } else {
                this.llmConfFormGroup
                    .get('huggingFaceTokenInput')
                    ?.setValue(hfToken);
            }
        }
    }

    private getModelsConfig(): void {
        this.toolsService.getVllmModelConfiguration().subscribe({
            next: (config: VllmModelConfig[]) => {
                this.vllModelsConfigurations = config;
                this.modelChanged();
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve model configuration. Please try again later."
                );
            },
        });
    }

    modelChanged(): void {
        const model = this.llmConfFormGroup.get('vllmModelSelect')?.value;
        this.modelNeedsToken =
            this.vllModelsConfigurations.find(
                (m) => `${m.family}/${m.name}` === model
            )?.needs_HF_token ?? false;

        if (this.modelNeedsToken) {
            this.llmConfFormGroup.get('huggingFaceTokenInput')?.enable();
        } else {
            this.llmConfFormGroup.get('huggingFaceTokenInput')?.disable();
        }
    }

    private setupValidationLogic(): void {
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

    private enableFields(fields: string[]): void {
        fields.forEach((field) => this.llmConfFormGroup.get(field)?.enable());
    }

    private disableFields(fields: string[]): void {
        fields.forEach((field) => this.llmConfFormGroup.get(field)?.disable());
    }

    getHFToken(): void {
        this.setLoading(true);
        const subpath = '/services/huggingface';
        this.secretsService.getSecrets(subpath).subscribe({
            next: (tokens) => {
                this.llmConfFormGroup
                    .get('huggingFaceTokenInput')
                    ?.setValue(Object.values(tokens)[0]?.token ?? '');
                this.setLoading(false);
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve your Hugging Face token. Please try again later."
                );
                this.setLoading(false);
            },
        });
    }
}
