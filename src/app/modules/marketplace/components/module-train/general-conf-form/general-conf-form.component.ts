import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';

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

    protected _defaultFormValues: any;
    protected _showHelp: any;

    serviceToRunOptions: { value: string; viewValue: string }[] = [];

    @Input() set showHelp(showHelp: any) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: any) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.generalConfFormGroup
                .get('dockerImageInput')
                ?.setValue(defaultFormValues.docker_image.value);
            this.generalConfFormGroup
                .get('serviceToRunSelect')
                ?.setValue(defaultFormValues.service.value);
            if (defaultFormValues.service) {
                defaultFormValues.service.options.forEach((service: any) => {
                    this.serviceToRunOptions.push({
                        value: service,
                        viewValue: service,
                    });
                });
            }
            defaultFormValues.docker_tag.options?.forEach((tag: any) => {
                this.dockerTagOptions.push({
                    value: tag,
                    viewValue: tag,
                });
            });
            this.generalConfFormGroup
                .get('dockerTagSelect')
                ?.setValue(defaultFormValues.docker_tag.value);
        }
    }

    isJupyterLab: boolean = false;
    hidePassword: boolean = true;

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
