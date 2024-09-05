import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService } from '@modules/marketplace/services/modules-service/modules.service';
import { Service } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-general-config-form',
    templateUrl: './general-config-form.component.html',
    styleUrls: ['./general-config-form.component.scss'],
})
export class GeneralConfigFormComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private clipboard: Clipboard,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
        private modulesService: ModulesService,
        private ctrlContainer: FormGroupDirective
    ) {}

    protected _showHelp = false;
    protected _defaultFormValues!: Service;

    parentForm!: FormGroup;
    fileName = '';
    currentFile?: File;
    fileContent: string | null = null;
    dockerImageName = '';
    oscar_endpoint = '';

    generalConfigFormGroup = this.fb.group({
        oscarUri: ['', Validators.required],
        serviceNameInput: ['', [Validators.required, Validators.maxLength(45)]],
        dockerImageInput: [{ value: '', disabled: true }],
        script: ['', [Validators.required]],
        environmentVariables: this.fb.array([]),
        labelItems: this.fb.array([]),
    });

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: Service) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.generalConfigFormGroup
                .get('dockerImageInput')
                ?.setValue(this._defaultFormValues.image as string);
        }
    }

    get environmentVariablesItems() {
        return this.generalConfigFormGroup.get(
            'environmentVariables'
        ) as FormArray;
    }

    addEnvironmentItem() {
        this.environmentVariablesItems.push(
            this.fb.group({
                keyInput: [''],
                valueInput: [''],
            })
        );
    }

    deleteEnvironmentItem(index: number) {
        this.environmentVariablesItems.removeAt(index);
    }

    get labelItems() {
        return this.generalConfigFormGroup.get('labelItems') as FormArray;
    }

    addLabelItem() {
        this.labelItems.push(
            this.fb.group({
                keyInput: [''],
                valueInput: [''],
            })
        );
    }

    deleteLabelItem(index: number) {
        this.labelItems.removeAt(index);
    }

    /**
     * On change event that populates the required file value
     * @param event event
     */
    selectFile(event: any): void {
        if (event.target.files && event.target.files[0]) {
            const file: File = event.target.files[0];

            if (!this.validateFileExtension(file)) {
                this._snackBar.open(
                    "Invalid extension. Only scripts with '.sh' and '.py' extension are accepted",
                    '×',
                    {
                        duration: 10000,
                        panelClass: ['red-snackbar'],
                    }
                );
                return;
            }

            if (file != null) {
                this.currentFile = file;
                this.fileName = file.name;
                this.readFileContent(file);
            }
        } else {
            this.currentFile = undefined;
            this.fileName = 'Select File';
        }
    }

    validateFileExtension(file: File): boolean {
        const allowedExtensions = ['.sh', '.py'];
        const isValidExtension = allowedExtensions.some((extension) =>
            file.name.toLowerCase().endsWith(extension)
        );
        return isValidExtension;
    }

    readFileContent(file: File): void {
        const reader = new FileReader();
        reader.onload = (event: any) => {
            this.fileContent = event.target.result.replace(/\r\n/g, '\n');
            this.generalConfigFormGroup
                .get('script')
                ?.setValue(this.fileContent);
        };
        reader.readAsText(file, 'UTF-8');
    }

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'generalConfigForm',
            this.generalConfigFormGroup
        );
    }
}
