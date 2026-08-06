import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import {
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatHint,
    MatSuffix,
} from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatDivider } from '@angular/material/list';
import { TranslatePipe } from '@ngx-translate/core';
import { emailValidator, urlValidator } from '@app/shared/utils/validators';

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
        MatProgressSpinner,
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        MatHint,
        MatSuffix,
        MatDivider,
        MatSelect,
        MatOption,
        MatIconButton,
        MatTooltip,
        MatIcon,
        TranslatePipe,
    ],
})
export class LlmConfFormComponent implements OnInit {
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
    protected isLoading = false;

    deploymentTypeOptions: SelectOption[] = [];
    vllmModelOptions: SelectOption[] = [];
    private vllModelsConfigurations: VllmModelConfig[] = [];

    modelNeedsToken = false;
    hideUiPassword = true;
    hideHFToken = true;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    /**
     * Model id preselected by the caller (e.g. navigated here from an LLM
     * catalog card with a specific model already chosen). Takes precedence
     * over the default model id returned by the configuration endpoint.
     */
    @Input() modelId?: string;

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: LlmConfiguration) {
        if (!defaultFormValues) {
            return;
        }
        this._defaultFormValues = defaultFormValues;

        this.deploymentTypeOptions = (
            defaultFormValues.type?.options ?? []
        ).map((type) => ({ value: type, viewValue: type }));
        this.llmConfFormGroup
            .get('deploymentTypeSelect')
            ?.setValue(defaultFormValues.type?.value as string);

        this.vllmModelOptions = (
            defaultFormValues.vllm_model_id?.options ?? []
        ).map((option) => ({ value: option, viewValue: option }));
        this.llmConfFormGroup
            .get('vllmModelSelect')
            ?.setValue(
                this.modelId ??
                    (defaultFormValues.vllm_model_id?.value as string)
            );
        this.modelChanged();

        this.llmConfFormGroup
            .get('uiPasswordInput')
            ?.setValue(defaultFormValues.ui_password?.value as string);
        this.llmConfFormGroup
            .get('openaiApiKeyInput')
            ?.setValue(defaultFormValues.openai_api_key?.value as string);
        this.llmConfFormGroup
            .get('openaiApiUrlInput')
            ?.setValue(defaultFormValues.openai_api_url?.value as string);

        const hfToken = localStorage.getItem('hf_access_token') ?? '';
        if (hfToken === '') {
            this.getHFToken();
        } else {
            this.llmConfFormGroup
                .get('huggingFaceTokenInput')
                ?.setValue(hfToken);
        }
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
        this.isLoading = true;
        const subpath = '/services/huggingface';
        this.secretsService.getSecrets(subpath).subscribe({
            next: (tokens) => {
                this.llmConfFormGroup
                    .get('huggingFaceTokenInput')
                    ?.setValue(Object.values(tokens)[0]?.token ?? '');
                this.isLoading = false;
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve your Hugging Face token. Please try again later."
                );
                this.isLoading = false;
            },
        });
    }

    openHFModel(): void {
        const url =
            'https://huggingface.co/' +
            this.llmConfFormGroup.get('vllmModelSelect')?.value;
        window.open(url);
    }
}
