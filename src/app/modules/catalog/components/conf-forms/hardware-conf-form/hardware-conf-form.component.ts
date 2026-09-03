import { MediaMatcher } from '@angular/cdk/layout';
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
import {
    ModuleHardwareConfiguration,
    ConfObjectRange,
} from '@app/shared/interfaces/module.interface';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { UiSelectComponent } from '@app/shared/components/ui/ui-select/ui-select.component';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';

export interface ShowHardwareField {
    cpu_num: boolean;
    ram: boolean;
    disk: boolean;
    gpu_num: boolean;
    gpu_type: boolean;
}

const mockedConfObject: ConfObjectRange = {
    range: [],
    name: '',
    value: '',
    description: '',
};

@Component({
    selector: 'app-hardware-conf-form',
    templateUrl: './hardware-conf-form.component.html',
    styleUrls: ['./hardware-conf-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        TranslatePipe,
        UiSelectComponent,
        UiTextFieldComponent,
    ],
})
export class HardwareConfFormComponent implements OnInit {
    ctrlContainer = inject(FormGroupDirective);
    fb = inject(FormBuilder);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    _showFields = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: true,
        gpu_type: true,
    };

    @Input() set showFields(showFields: ShowHardwareField) {
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

    hardwareConfFormGroup = this.fb.group({
        cpuNumberInput: ['', []],
        gpuNumberInput: [0, []],
        gpuModelSelect: [{ value: '', disabled: true }],
        ramMemoryInput: ['', []],
        diskMemoryInput: ['', []],
    });

    protected _showHelp = false;
    protected _isFederatedModule = false;

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

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

            // --- CPU ---
            this.hardwareConfFormGroup
                .get('cpuNumberInput')
                ?.setValidators([
                    ...(this._showFields.cpu_num ? [Validators.required] : []),
                    Validators.min(defaultFormValues.cpu_num.range[0]),
                    Validators.max(defaultFormValues.cpu_num.range[1]),
                ]);
            this.hardwareConfFormGroup
                .get('cpuNumberInput')
                ?.setValue(defaultFormValues.cpu_num.value as string);
            this.hardwareConfFormGroup
                .get('cpuNumberInput')
                ?.updateValueAndValidity();

            // --- GPU ---
            this.hardwareConfFormGroup
                .get('gpuNumberInput')
                ?.setValidators([
                    ...(this._showFields.gpu_num ? [Validators.required] : []),
                    Validators.min(defaultFormValues.gpu_num?.range[0]),
                    Validators.max(defaultFormValues.gpu_num?.range[1]),
                ]);
            this.hardwareConfFormGroup
                .get('gpuNumberInput')
                ?.setValue(defaultFormValues.gpu_num?.value as number);
            this.hardwareConfFormGroup
                .get('gpuNumberInput')
                ?.updateValueAndValidity();

            // --- RAM ---
            this.hardwareConfFormGroup
                .get('ramMemoryInput')
                ?.setValidators([
                    ...(this._showFields.ram ? [Validators.required] : []),
                    Validators.min(defaultFormValues.ram?.range[0]),
                    Validators.max(defaultFormValues.ram?.range[1]),
                ]);
            this.hardwareConfFormGroup
                .get('ramMemoryInput')
                ?.setValue(defaultFormValues.ram?.value as string);
            this.hardwareConfFormGroup
                .get('ramMemoryInput')
                ?.updateValueAndValidity();

            // --- DISK ---
            this.hardwareConfFormGroup
                .get('diskMemoryInput')
                ?.setValidators([
                    ...(this._showFields.disk ? [Validators.required] : []),
                    Validators.min(defaultFormValues.disk?.range[0]),
                    Validators.max(defaultFormValues.disk?.range[1]),
                ]);
            this.hardwareConfFormGroup
                .get('diskMemoryInput')
                ?.setValue(defaultFormValues.disk?.value as string);
            this.hardwareConfFormGroup
                .get('diskMemoryInput')
                ?.updateValueAndValidity();

            defaultFormValues.gpu_type?.options?.forEach((tag: string) => {
                this.gpuModelOptions.push({ value: tag, viewValue: tag });
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

        setTimeout(() => {
            this.parentForm.updateValueAndValidity();
        });

        this.gpuNumberSelectorBehaviourHandler();
    }
}
