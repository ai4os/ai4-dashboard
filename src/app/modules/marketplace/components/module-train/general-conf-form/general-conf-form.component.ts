import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import { ModuleGeneralConfiguration } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-general-conf-form',
    templateUrl: './general-conf-form.component.html',
    styleUrls: ['./general-conf-form.component.scss'],
})
export class GeneralConfFormComponent implements OnInit {
    constructor(
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder
    ) {}

    parentForm!: FormGroup;

    protected _defaultFormValues!: ModuleGeneralConfiguration;
    protected _showHelp = false;

    serviceToRunOptions: { value: string; viewValue: string }[] = [];

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
                .get('serviceToRunSelect')
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
        }
    }

    isJupyterLab = false;
    hidePassword = true;

    generalConfFormGroup = this.fb.group({
        descriptionInput: [''],
        serviceToRunSelect: ['deepaas'],
        titleInput: ['', [Validators.required, Validators.maxLength(45)]],
        jupyterLabPassInput: [
            { value: '', disabled: true },
            [Validators.required, Validators.minLength(9)],
        ],
        dockerImageInput: [{ value: '', disabled: true }],
        dockerTagSelect: [''],
        hostnameInput: [''],
    });

    dockerTagOptions: { value: string; viewValue: string }[] = [];

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'generalConfForm',
            this.generalConfFormGroup
        );
        this.generalConfFormGroup
            .get('serviceToRunSelect')
            ?.valueChanges.subscribe((val) => {
                if (val === 'jupyter' || val === 'vscode') {
                    this.isJupyterLab = true;
                } else {
                    this.isJupyterLab = false;
                }
                if (this.isJupyterLab) {
                    this.generalConfFormGroup
                        .get('jupyterLabPassInput')
                        ?.enable();
                } else {
                    this.generalConfFormGroup
                        .get('jupyterLabPassInput')
                        ?.disable();
                }
            });
    }
}
