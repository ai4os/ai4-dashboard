import {
    trigger,
    transition,
    style,
    animate,
    animateChild,
    query,
} from '@angular/animations';
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
    FormControl,
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
import { MatIconButton, MatFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { NgClass, TitleCasePipe } from '@angular/common';
import {
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatHint,
    MatSuffix,
} from '@angular/material/input';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatDivider } from '@angular/material/list';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { SingleFileUploadComponent } from '../../../../../shared/components/single-file-upload/single-file-upload.component';
import { TextEditorComponent } from '../../../../../shared/components/text-editor/text-editor.component';
import { CopyToClipboardDirective } from '../../../../../shared/directives/copy-to-clipboard.directive';
import { TranslatePipe } from '@ngx-translate/core';

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
    // batch
    batchFields: boolean;
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
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        UiSelectComponent,
        UiTextFieldComponent,
        UiButtonComponent,
        UiToggleComponent,
        FormsModule,
        ReactiveFormsModule,
        MatIconButton,
        MatTooltip,
        MatIcon,
        NgClass,
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        MatHint,
        MatChipListbox,
        MatChipOption,
        MatSuffix,
        MatDivider,
        MatSelect,
        MatOption,
        MatTabGroup,
        MatTab,
        SingleFileUploadComponent,
        TextEditorComponent,
        CopyToClipboardDirective,
        MatFabButton,
        TitleCasePipe,
        TranslatePipe,
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

    protected readonly titleErrors = {
        required:
            'CATALOG.MODULE-TRAIN.GENERAL-CONF-FORM.DEPLOYMENT-TITLE-REQUIRED',
    };
    protected readonly servicePasswordErrors = {
        required:
            'CATALOG.MODULE-TRAIN.GENERAL-CONF-FORM.JUPYTERLAB-PASS-REQUIRED',
        minlength:
            'CATALOG.MODULE-TRAIN.GENERAL-CONF-FORM.JUPYTERLAB-PASS-LENGTH-ERROR',
    };

    serviceToRunOptions: { value: string; viewValue: string }[] = [];
    dockerTagOptions: { value: string; viewValue: string }[] = [];
    modelIdOptions: { value: string; viewValue: string }[] = [];

    initialCommandText = '';
    commandText = '';
    textManuallyModified = false;
    textEditorPlaceholder =
        'python /src/my-app/my-app/train.py --epochs 10 \ncp -r /src/my-app/models /storage/my-new-modelsweights \n...';

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
        batchFile: new FormControl<File | null>(
            { value: null, disabled: true },
            Validators.required
        ),
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
        } else if (this._showFields.batchFields) {
            this.generalConfFormGroup.get('batchFile')?.enable();
        }
    }

    updateBatchFile(file: File) {
        this.generalConfFormGroup.get('batchFile')?.setValue(file);
    }

    openBatchTrainingDocs() {
        const url =
            'https://docs.ai4os.eu/en/latest/howtos/train/batch.html#configuring-a-batch-job';
        window.open(url);
    }

    createFileFromText(): void {
        const content = this.commandText.trim();
        this.initialCommandText = content;
        const blob = new Blob([content], { type: 'text/x-shellscript' });
        const file = new File([blob], 'script-from-text.sh', {
            type: 'text/x-shellscript',
        });
        this.updateBatchFile(file);
        this.snackbarService.openSuccess(
            'Batch command file generated successfully!'
        );
        this.textManuallyModified = false;
    }

    clearFileData(): void {
        this.generalConfFormGroup.get('batchFile')?.setValue(null);
        this.textManuallyModified = false;
    }

    onCommandTextChange(newValue: string): void {
        this.commandText = newValue;
        this.textManuallyModified =
            this.commandText.trim() !== this.initialCommandText.trim();
    }
}
