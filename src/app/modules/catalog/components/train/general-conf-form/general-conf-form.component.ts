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
import { ModuleGeneralConfiguration } from '@app/shared/interfaces/module.interface';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '@app/core/services/auth/auth.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { UiSelectComponent } from '@app/shared/components/ui/ui-select/ui-select.component';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { UiToggleComponent } from '@app/shared/components/ui/ui-toggle/ui-toggle.component';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import {
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatHint,
    MatSuffix,
} from '@angular/material/input';
import { MatDivider } from '@angular/material/list';
import { MatSelect, MatOption } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { UiChipGroupComponent } from '@app/shared/components/ui/ui-chip-group/ui-chip-group.component';

export interface ShowGeneralFormField {
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
    /**
     * @deprecated LLM fields moved to app-llm-conf-form. This flag is no
     * longer read by GeneralConfFormComponent; kept optional so existing
     * consumers don't need to change until they migrate to the new component.
     */
    llmFields?: boolean;
    /**
     * @deprecated batch
     */
    batchFields: boolean;
}

@Component({
    selector: 'app-general-conf-form',
    templateUrl: './general-conf-form.component.html',
    styleUrls: ['./general-conf-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        UiSelectComponent,
        UiTextFieldComponent,
        UiButtonComponent,
        UiToggleComponent,
        FormsModule,
        ReactiveFormsModule,
        MatIcon,
        NgClass,
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        MatHint,
        MatSuffix,
        MatDivider,
        MatSelect,
        MatOption,
        TranslatePipe,
        UiChipGroupComponent,
    ],
})
export class GeneralConfFormComponent implements OnInit {
    authService = inject(AuthService);
    snackbarService = inject(SnackbarService);
    ctrlContainer = inject(FormGroupDirective);
    fb = inject(FormBuilder);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
        this.authService.loadUserProfile();
    }

    parentForm!: FormGroup;

    protected _defaultFormValues!: ModuleGeneralConfiguration;
    protected _showHelp = false;

    protected readonly servicePasswordErrors = {
        required: 'CATALOG.CONF-FORMS.GENERAL.JUPYTERLAB-PASS-REQUIRED',
        minlength: 'CATALOG.CONF-FORMS.GENERAL.JUPYTERLAB-PASS-LENGTH-ERROR',
    };

    serviceToRunOptions: { value: string; viewValue: string }[] = [];
    dockerTagOptions: { value: string; viewValue: string }[] = [];
    modelIdOptions: { value: string; viewValue: string }[] = [];

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

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
        batchFields: false,
    };

    @Input() set showFields(showFields: ShowGeneralFormField) {
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
        }
    }

    isPasswodRequired = false;
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

        this.authService.userProfile$.subscribe((profile) => {
            if (profile && this._showFields.cvatFields) {
                this.generalConfFormGroup
                    .get('cvatUsernameInput')
                    ?.setValue(profile.email);
                this.changeDetectorRef.detectChanges();
            }
        });

        if (this._showFields.cvatFields) {
            this.generalConfFormGroup.get('cvatUsernameInput')?.enable();
            this.generalConfFormGroup.get('cvatPasswordInput')?.enable();
        }
    }
}
