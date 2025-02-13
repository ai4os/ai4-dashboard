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
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import { ModuleGeneralConfiguration } from '@app/shared/interfaces/module.interface';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '@app/core/services/auth/auth.service';

export interface showGeneralFormField {
    descriptionInput: boolean;
    serviceToRunChip: boolean;
    titleInput: boolean;
    serviceToRunPassInput: boolean;
    dockerImageInput: boolean;
    dockerTagSelect: boolean;
    infoButton: boolean;
    cvatUsername: boolean;
    cvatPassword: boolean;
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
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
        authService.loadUserProfile();
    }

    parentForm!: FormGroup;

    protected _defaultFormValues!: ModuleGeneralConfiguration;
    protected _showHelp = false;

    serviceToRunOptions: { value: string; viewValue: string }[] = [];

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    _showFields = {
        descriptionInput: true,
        serviceToRunChip: true,
        titleInput: true,
        serviceToRunPassInput: true,
        dockerImageInput: true,
        dockerTagSelect: true,
        infoButton: false,
        cvatUsername: false,
        cvatPassword: false,
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

            this.generalConfFormGroup
                .get('cvatUsernameInput')
                ?.setValue(defaultFormValues.cvat_username?.value as string);

            this.generalConfFormGroup
                .get('cvatPasswordInput')
                ?.setValue(defaultFormValues.cvat_password?.value as string);
        }
    }

    isPasswodRequired = false;
    hideServiceToRunPassword = true;
    hideCvatPassword = true;

    generalConfFormGroup = this.fb.group({
        descriptionInput: [''],
        serviceToRunChip: ['deepaas'],
        titleInput: ['', [Validators.maxLength(45)]],
        serviceToRunPassInput: [
            { value: '', disabled: true },
            [Validators.required, Validators.minLength(9)],
        ],
        dockerImageInput: [{ value: '', disabled: true }],
        dockerTagSelect: [''],
        federatedSecretInput: [{ value: '', disabled: true }],
        cvatUsernameInput: ['', [Validators.required]],
        cvatPasswordInput: ['', [Validators.required]],
    });

    dockerTagOptions: { value: string; viewValue: string }[] = [];

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

        if (this._showFields.cvatUsername && this._showFields.cvatPassword) {
            this.authService.userProfileSubject.subscribe((profile) => {
                const email = profile.email;
                this.generalConfFormGroup
                    .get('cvatUsernameInput')
                    ?.setValue(email);
            });
        } else {
            this.generalConfFormGroup.get('cvatUsernameInput')?.disable();
            this.generalConfFormGroup.get('cvatPasswordInput')?.disable();
        }
    }

    openDocumentationWeb(): void {
        const url =
            'https://docs.ai4eosc.eu/en/latest/user/howto/train/federated-server.html';
        window.open(url);
    }
}
