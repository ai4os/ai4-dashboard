import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import {
    ModuleHardwareConfiguration,
    confObjectRange,
} from '@app/shared/interfaces/module.interface';

export interface showHardwareField {
    cpu_num: boolean;
    ram: boolean;
    disk: boolean;
    gpu_num: boolean;
    gpu_type: boolean;
}

const mockedConfObject: confObjectRange = {
    range: [],
    name: '',
    value: '',
    description: '',
};

@Component({
    selector: 'app-hardware-conf-form',
    templateUrl: './hardware-conf-form.component.html',
    styleUrls: ['./hardware-conf-form.component.scss'],
})
export class HardwareConfFormComponent implements OnInit {
    constructor(
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder
    ) {}

    _showFields = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: true,
        gpu_type: true,
    };

    @Input() set showFields(showFields: showHardwareField) {
        this._showFields = showFields;
    }
    parentForm!: FormGroup;

    protected _defaultFormValues: ModuleHardwareConfiguration = {
        cpu_num: mockedConfObject,
        ram: mockedConfObject,
        disk: mockedConfObject,
        gpu_num: mockedConfObject,
        gpu_type: mockedConfObject,
    };

    isGpuModelSelectDisabled = true;
    //this.hardwareConfFormGroup.get('gpuNumberInput')?.value! < 1

    hardwareConfFormGroup = this.fb.group({
        cpuNumberInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.cpu_num.range[0]),
                Validators.max(this.defaultFormValues?.cpu_num.range[1]),
            ],
        ],
        gpuNumberInput: [
            0,
            [
                Validators.min(this.defaultFormValues?.gpu_num.range[0]),
                Validators.max(this.defaultFormValues?.gpu_num.range[1]),
            ],
        ],
        descriptionInput: [''],
        gpuModelSelect: [{ value: '', disabled: true }, [Validators.required]],
        ramMemoryInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.ram.range[0]),
                Validators.max(this.defaultFormValues?.ram.range[1]),
            ],
        ],
        diskMemoryInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.disk.range[0]),
                Validators.max(this.defaultFormValues?.disk.range[1]),
            ],
        ],
    });

    protected _showHelp = false;
    protected _isFederatedModule = false;

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set isFederatedModule(isFederatedModule: boolean) {
        this._isFederatedModule = isFederatedModule;
    }

    @Input() set defaultFormValues(
        defaultFormValues: ModuleHardwareConfiguration
    ) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.hardwareConfFormGroup
                .get('cpuNumberInput')
                ?.setValue(defaultFormValues.cpu_num.value as string);
            this.hardwareConfFormGroup
                .get('gpuNumberInput')
                ?.setValue(defaultFormValues.gpu_num?.value as number);
            this.hardwareConfFormGroup
                .get('ramMemoryInput')
                ?.setValue(defaultFormValues.ram.value as string);
            this.hardwareConfFormGroup
                .get('diskMemoryInput')
                ?.setValue(defaultFormValues.disk.value as string);
            defaultFormValues.gpu_type?.options?.forEach((tag: string) => {
                this.gpuModelOptions.push({
                    value: tag,
                    viewValue: tag,
                });
            });
            this.hardwareConfFormGroup
                .get('gpuModelSelect')
                ?.setValue(defaultFormValues.gpu_type?.value as string);
        }
    }

    gpuModelOptions: { value: string; viewValue: string }[] = [];

    /**
     * Method to handle wether the gpuNumberSelector should be disabled or not.
     */
    gpuNumberSelectorBehaviourHandler() {
        const gpuNumberInputControl =
            this.hardwareConfFormGroup.get('gpuNumberInput')?.value;

        if (
            typeof gpuNumberInputControl == 'number' &&
            gpuNumberInputControl > 0
        ) {
            this.isGpuModelSelectDisabled = false;
        }
        this.hardwareConfFormGroup
            .get('gpuNumberInput')
            ?.valueChanges.subscribe((value: number | null) => {
                if (
                    value &&
                    value > 0 &&
                    this._defaultFormValues?.gpu_num.range[1] > 0
                ) {
                    this.isGpuModelSelectDisabled = false;
                    this.hardwareConfFormGroup.get('gpuModelSelect')?.enable();
                } else {
                    this.hardwareConfFormGroup.get('gpuModelSelect')?.disable();
                }
            });
    }

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'hardwareConfForm',
            this.hardwareConfFormGroup
        );
        this.gpuNumberSelectorBehaviourHandler();
    }
}
