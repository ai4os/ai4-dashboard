import {
    trigger,
    transition,
    style,
    animate,
    animateChild,
    query,
} from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {
    ModuleGeneralConfiguration,
    VllmModelConfig,
} from '@app/shared/interfaces/module.interface';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { SecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service';

export function urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const urlPattern =
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i;
        const value = control.value;
        const validURL = urlPattern.test(value);
        return validURL ? null : { invalidURL: true };
    };
}

export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const value = control.value;
        const validEmail = emailPattern.test(value);
        return validEmail ? null : { invalidEmail: true };
    };
}

export interface showGeneralFormField {
    descriptionInput: boolean;
    serviceToRunChip: boolean;
    titleInput: boolean;
    co2EmissionsInput: boolean;
    serviceToRunPassInput: boolean;
    dockerImageInput: boolean;
    dockerTagSelect: boolean;
    infoButton: boolean;
    // cvat
    cvatFields: boolean;
    // ai4life
    ai4lifeFields: boolean;
    // llm
    llmFields: boolean;
}

@Component({
    selector: 'app-general-conf-form',
    templateUrl: './general-conf-form.component.html',
    styleUrls: ['./general-conf-form.component.scss'],
    animations: [
        trigger('inOutAnimation', [
            transition(':enter', [
                style({ visibility: 'hidden', opacity: 0 }),
                animate(
                    '0.2s ease-out',
                    style({ visibility: 'visible', opacity: 1 })
                ),
            ]),
            transition(':leave', [
                query('@*', [animateChild()], { optional: true }),
                style({ visibility: 'visible', opacity: 1 }),
                animate(
                    '0.1s ease-in',
                    style({ visibility: 'hidden', opacity: 0 })
                ),
            ]),
        ]),
    ],
})
export class GeneralConfFormComponent implements OnInit {
    constructor(
        private readonly authService: AuthService,
        private toolsService: ToolsService,
        private snackbarService: SnackbarService,
        private secretsService: SecretsService,
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private router: Router
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
        authService.loadUserProfile();
    }

    parentForm!: FormGroup;

    protected _defaultFormValues!: ModuleGeneralConfiguration;
    protected _showHelp = false;
    protected isLoading = false;

    serviceToRunOptions: { value: string; viewValue: string }[] = [];
    dockerTagOptions: { value: string; viewValue: string }[] = [];
    modelIdOptions: { value: string; viewValue: string }[] = [];
    deploymentTypeOptions: { value: string; viewValue: string }[] = [];
    vllmModelOptions: any = [];
    vllModelsConfigurations: VllmModelConfig[] = [];

    modelNeedsToken = false;
    hideUiPassword = true;
    hideHFToken = true;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    _showFields = {
        descriptionInput: true,
        serviceToRunChip: true,
        titleInput: true,
        co2EmissionsInput: false,
        serviceToRunPassInput: true,
        dockerImageInput: true,
        dockerTagSelect: true,
        infoButton: false,
        cvatFields: false,
        ai4lifeFields: false,
        llmFields: false,
    };

    @Input() set showFields(showFields: showGeneralFormField) {
        this._showFields = showFields;
    }

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(
        defaultFormValues: ModuleGeneralConfiguration
    ) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;

            this.generalConfFormGroup
                .get('titleInput')
                ?.setValue(defaultFormValues.title.value as string);
            this.generalConfFormGroup
                .get('descriptionInput')
                ?.setValue(defaultFormValues.desc?.value as string);
            this.generalConfFormGroup
                .get('co2EmissionsInput')
                ?.setValue(defaultFormValues.co2?.value as boolean);
            this.generalConfFormGroup
                .get('dockerImageInput')
                ?.setValue(defaultFormValues.docker_image?.value as string);
            defaultFormValues.docker_tag?.options?.forEach((tag: string) => {
                this.dockerTagOptions.push({
                    value: tag,
                    viewValue: tag,
                });
            });

            this.generalConfFormGroup
                .get('dockerTagSelect')
                ?.setValue(defaultFormValues.docker_tag?.value as string);

            this.generalConfFormGroup
                .get('serviceToRunPassInput')
                ?.setValue(defaultFormValues.jupyter_password?.value as string);

            this.generalConfFormGroup
                .get('serviceToRunChip')
                ?.setValue(defaultFormValues.service?.value as string);
            defaultFormValues.service?.options?.forEach((service: string) => {
                this.serviceToRunOptions.push({
                    value: service,
                    viewValue: service,
                });
            });

            // CVAT
            this.generalConfFormGroup
                .get('cvatUsernameInput')
                ?.setValue(defaultFormValues.cvat_username?.value as string);
            this.generalConfFormGroup
                .get('cvatPasswordInput')
                ?.setValue(defaultFormValues.cvat_password?.value as string);

            // AI4LIFE
            this.generalConfFormGroup
                .get('modelIdSelect')
                ?.setValue(defaultFormValues.model_id?.value as string);
            defaultFormValues.model_id?.options?.forEach((tag: string) => {
                this.modelIdOptions.push({
                    value: tag,
                    viewValue: tag,
                });
            });

            // LLM
            this.generalConfFormGroup
                .get('deploymentTypeSelect')
                ?.setValue(defaultFormValues.llm?.type.value as string);
            defaultFormValues.llm?.type.options?.forEach((type: string) => {
                this.deploymentTypeOptions.push({
                    value: type,
                    viewValue: type,
                });
            });

            const selectedModel =
                this.router.lastSuccessfulNavigation?.extras?.state?.['llmId'];
            if (selectedModel) {
                this.generalConfFormGroup
                    .get('vllmModelSelect')
                    ?.setValue(selectedModel);
            } else {
                this.generalConfFormGroup
                    .get('vllmModelSelect')
                    ?.setValue(
                        defaultFormValues.llm?.vllm_model_id.value as string
                    );
            }
            defaultFormValues.llm?.vllm_model_id.options?.forEach(
                (option: any) => {
                    this.vllmModelOptions.push({
                        value: option,
                        viewValue: option,
                    });
                }
            );

            this.generalConfFormGroup
                .get('uiPasswordInput')
                ?.setValue(defaultFormValues.llm?.ui_password.value as string);

            const hfToken = localStorage.getItem('hf_access_token') ?? '';
            if (hfToken === '') {
                this.getHFToken();
            } else {
                this.generalConfFormGroup
                    .get('huggingFaceTokenInput')
                    ?.setValue(hfToken);
            }

            this.generalConfFormGroup
                .get('openaiApiKeyInput')
                ?.setValue(
                    defaultFormValues.llm?.openai_api_key.value as string
                );
            this.generalConfFormGroup
                .get('openaiApiUrlInput')
                ?.setValue(
                    defaultFormValues.llm?.openai_api_url.value as string
                );
        }
    }

    isPasswodRequired = false;
    hideServiceToRunPassword = true;
    hideCvatPassword = true;

    generalConfFormGroup = this.fb.group({
        descriptionInput: [''],
        serviceToRunChip: ['deepaas'],
        titleInput: ['', [Validators.maxLength(45)]],
        co2EmissionsInput: false,
        serviceToRunPassInput: [
            { value: '', disabled: true },
            [Validators.required, Validators.minLength(9)],
        ],
        dockerImageInput: [{ value: '', disabled: true }],
        dockerTagSelect: [''],
        federatedSecretInput: [{ value: '', disabled: true }],
        // CVAT
        cvatUsernameInput: [
            { value: '', disabled: true },
            [Validators.required],
        ],
        cvatPasswordInput: [
            { value: '', disabled: true },
            [Validators.required],
        ],
        // AI4LIFE
        modelIdSelect: [''],
        // LLM
        deploymentTypeSelect: [
            { value: '', disabled: true },
            Validators.required,
        ],
        vllmModelSelect: [{ value: '', disabled: true }, Validators.required],
        uiUsernameInput: [
            { value: '', disabled: true },
            [Validators.required, emailValidator()],
        ],
        uiPasswordInput: [{ value: '', disabled: true }, Validators.required],
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
        this.parentForm.addControl(
            'generalConfForm',
            this.generalConfFormGroup
        );
        this.generalConfFormGroup
            .get('serviceToRunChip')
            ?.valueChanges.subscribe((val) => {
                if (val === 'jupyter' || val === 'vscode') {
                    this.isPasswodRequired = true;
                } else {
                    this.isPasswodRequired = false;
                }
                if (this.isPasswodRequired) {
                    this.generalConfFormGroup
                        .get('serviceToRunPassInput')
                        ?.enable();
                } else {
                    this.generalConfFormGroup
                        .get('serviceToRunPassInput')
                        ?.disable();
                }
            });

        this.authService.userProfileSubject.subscribe((profile) => {
            const email = profile.email;
            if (this._showFields.llmFields) {
                this.generalConfFormGroup
                    .get('uiUsernameInput')
                    ?.setValue(email);
            } else if (this._showFields.cvatFields) {
                this.generalConfFormGroup
                    .get('cvatUsernameInput')
                    ?.setValue(email);
            }
        });

        if (this._showFields.llmFields) {
            this.getModelsConfig();
            this.setupValidationLogic();
            this.generalConfFormGroup.get('deploymentTypeSelect')?.enable();
            this.generalConfFormGroup.get('vllmModelSelect')?.enable();
            this.generalConfFormGroup.get('uiPasswordInput')?.enable();
            this.generalConfFormGroup.get('uiUsernameInput')?.enable();
        } else if (this._showFields.cvatFields) {
            this.generalConfFormGroup.get('cvatUsernameInput')?.enable();
            this.generalConfFormGroup.get('cvatPasswordInput')?.enable();
        }
    }

    getModelsConfig() {
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

    modelChanged() {
        const model = this.generalConfFormGroup.get('vllmModelSelect')?.value;
        this.modelNeedsToken =
            this.vllModelsConfigurations.find(
                (m) => m.family + '/' + m.name === model
            )?.needs_HF_token ?? false;
        if (this.modelNeedsToken) {
            this.generalConfFormGroup.get('huggingFaceTokenInput')?.enable();
        } else {
            this.generalConfFormGroup.get('huggingFaceTokenInput')?.disable();
        }
    }

    private setupValidationLogic() {
        this.generalConfFormGroup
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
            this.generalConfFormGroup.get(field)?.enable();
        });
    }

    private disableFields(fields: string[]) {
        fields.forEach((field) => {
            this.generalConfFormGroup.get(field)?.disable();
        });
    }

    openFedServerDocs(): void {
        const url =
            'https://docs.ai4eosc.eu/en/latest/howtos/train/federated-server.html';
        window.open(url);
    }

    openCo2Docs(): void {
        const url =
            'https://docs.ai4eosc.eu/en/latest/howtos/train/federated-server.html#monitoring-of-training-co2-emissions';
        window.open(url);
    }

    getHFToken() {
        this.isLoading = true;
        const subpath = '/services/huggingface';
        this.secretsService.getSecrets(subpath).subscribe({
            next: (tokens) => {
                this.generalConfFormGroup
                    .get('huggingFaceTokenInput')
                    ?.setValue(Object.values(tokens)[0].token ?? '');
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
}
