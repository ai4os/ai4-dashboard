import {
    trigger,
    transition,
    style,
    animate,
    animateChild,
    query,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleGeneralConfiguration } from '@app/shared/interfaces/module.interface';
import { Clipboard } from '@angular/cdk/clipboard';

export interface showGeneralFormField {
    descriptionInput: boolean;
    serviceToRunChip: boolean;
    titleInput: boolean;
    serviceToRunPassInput: boolean;
    dockerImageInput: boolean;
    dockerTagSelect: boolean;
    hostnameInput: boolean;
    federated_secret: boolean;
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
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder,
        private clipboard: Clipboard,
        private _snackBar: MatSnackBar
    ) {}

    parentForm!: FormGroup;

    protected _defaultFormValues!: ModuleGeneralConfiguration;
    protected _showHelp = false;

    serviceToRunOptions: { value: string; viewValue: string }[] = [];

    _showFields = {
        descriptionInput: true,
        serviceToRunChip: true,
        titleInput: true,
        serviceToRunPassInput: true,
        dockerImageInput: true,
        dockerTagSelect: true,
        hostnameInput: true,
        federated_secret: false,
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
                .get('dockerImageInput')
                ?.setValue(defaultFormValues.docker_image.value as string);
            this.generalConfFormGroup
                .get('serviceToRunChip')
                ?.setValue(defaultFormValues.service.value as string);
            if (defaultFormValues.service) {
                defaultFormValues.service.options?.forEach(
                    (service: string) => {
                        this.serviceToRunOptions.push({
                            value: service,
                            viewValue: service,
                        });
                    }
                );
            }
            defaultFormValues.docker_tag.options?.forEach((tag: string) => {
                this.dockerTagOptions.push({
                    value: tag,
                    viewValue: tag,
                });
            });
            this.generalConfFormGroup
                .get('dockerTagSelect')
                ?.setValue(defaultFormValues.docker_tag.value as string);
            this.generalConfFormGroup
                .get('federatedSecretInput')
                ?.setValue(defaultFormValues.federated_secret?.value as string);
        }
    }

    isPasswodRequired = false;
    hidePassword = true;

    generalConfFormGroup = this.fb.group({
        descriptionInput: [''],
        serviceToRunChip: ['deepaas'],
        titleInput: ['', [Validators.required, Validators.maxLength(45)]],
        serviceToRunPassInput: [
            { value: '', disabled: true },
            [Validators.required, Validators.minLength(9)],
        ],
        dockerImageInput: [{ value: '', disabled: true }],
        dockerTagSelect: [''],
        hostnameInput: [''],
        federatedSecretInput: [{ value: '', disabled: true }],
    });

    dockerTagOptions: { value: string; viewValue: string }[] = [];

    copyValueToClipboard(value: string | null | undefined) {
        if (value) {
            this.clipboard.copy(value);
            this._snackBar.open('Copied to clipboard!', 'X', {
                duration: 3000,
                panelClass: ['primary-snackbar'],
            });
        }
    }

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
    }
}
