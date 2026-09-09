import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UiToggleComponent } from '@app/shared/components/ui/ui-toggle/ui-toggle.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import {
    SelectOption,
    UiSelectComponent,
} from '@app/shared/components/ui/ui-select/ui-select.component';
import { UiChipInputComponent } from '@app/shared/components/ui/ui-chip-input/ui-chip-input.component';
import {
    ConfObject,
    ConfObjectBoolean,
    ConfObjectRange,
    FederatedServerConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';

const mockedRange: ConfObjectRange = {
    range: [],
    name: '',
    value: '',
    description: '',
};

const mockedString: ConfObject = {
    name: '',
    value: '',
    description: '',
};

const mockedOptions: ConfObject = {
    name: '',
    value: '',
    options: [],
    description: '',
};

const mockedBoolean: ConfObjectBoolean = {
    name: '',
    value: false,
    description: '',
};

@Component({
    selector: 'app-federated-conf-form',
    templateUrl: './federated-conf-form.component.html',
    styleUrls: ['./federated-conf-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        UiToggleComponent,
        UiButtonComponent,
        UiSelectComponent,
        UiTextFieldComponent,
        UiChipInputComponent,
        TranslatePipe,
    ],
})
export class FederatedConfFormComponent implements OnInit {
    ctrlContainer = inject(FormGroupDirective);
    fb = inject(FormBuilder);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);
    private readonly translate = inject(TranslateService);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    parentForm!: FormGroup;

    federatedConfFormGroup = this.fb.group({
        roundsInput: [''],
        metricInput: [[] as string[]],
        minFitClientsInput: [''],
        minAvailableClientsInput: [''],
        strategyOptionsSelect: [''],
        muInput: [''],
        flInput: [''],
        momentumInput: [''],
        dpInput: [false],
        mpInput: [false],
        noiseMultInput: [''],
        sampledClientsNumInput: [''],
        clippingNormInput: [''],
    });

    protected _defaultFormValues: FederatedServerConfiguration = {
        rounds: mockedRange,
        metric: mockedString,
        min_fit_clients: mockedRange,
        min_available_clients: mockedRange,
        strategy: mockedOptions,
        mu: mockedRange,
        fl: mockedRange,
        momentum: mockedRange,
        dp: mockedBoolean,
        mp: mockedOptions,
        noise_mult: mockedRange,
        sampled_clients: mockedRange,
        clip_norm: mockedRange,
    };

    protected _showHelp = false;
    protected showStrategiesInfo = false;

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

    @Input() set showHelp(showHelp: any) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: any) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;

            // --- Rounds ---
            this.federatedConfFormGroup
                .get('roundsInput')
                ?.setValidators([
                    Validators.required,
                    Validators.min(defaultFormValues.rounds?.range?.[0]),
                    Validators.max(defaultFormValues.rounds?.range?.[1]),
                ]);
            this.federatedConfFormGroup
                .get('roundsInput')
                ?.setValue(defaultFormValues.rounds?.value);

            // --- Metrics ---
            const metricVal = defaultFormValues.metric?.value;
            this.federatedConfFormGroup
                .get('metricInput')
                ?.setValue(
                    metricVal
                        ? Array.isArray(metricVal)
                            ? metricVal
                            : [metricVal]
                        : []
                );

            // --- Min Fit Clients ---
            this.federatedConfFormGroup
                .get('minFitClientsInput')
                ?.setValidators([
                    Validators.required,
                    Validators.min(
                        defaultFormValues.min_fit_clients?.range?.[0]
                    ),
                    Validators.max(
                        defaultFormValues.min_fit_clients?.range?.[1]
                    ),
                ]);
            this.federatedConfFormGroup
                .get('minFitClientsInput')
                ?.setValue(defaultFormValues.min_fit_clients?.value);

            // --- Min Available Clients ---
            this.federatedConfFormGroup
                .get('minAvailableClientsInput')
                ?.setValidators([
                    Validators.required,
                    Validators.min(
                        defaultFormValues.min_available_clients?.range?.[0]
                    ),
                    Validators.max(
                        defaultFormValues.min_available_clients?.range?.[1]
                    ),
                ]);
            this.federatedConfFormGroup
                .get('minAvailableClientsInput')
                ?.setValue(defaultFormValues.min_available_clients?.value);

            // --- Strategies ---
            this.federatedConfFormGroup
                .get('strategyOptionsSelect')
                ?.setValidators([Validators.required]);
            this.federatedConfFormGroup
                .get('strategyOptionsSelect')
                ?.setValue(defaultFormValues.strategy?.value);

            this.strategyOptions = [];
            defaultFormValues.strategy?.options?.forEach((option: any) => {
                this.strategyOptions.push({ value: option, viewValue: option });
            });

            // --- Mu ---
            this.federatedConfFormGroup
                .get('muInput')
                ?.setValidators([
                    Validators.min(defaultFormValues.mu?.range?.[0]),
                    Validators.max(defaultFormValues.mu?.range?.[1]),
                ]);
            this.federatedConfFormGroup
                .get('muInput')
                ?.setValue(defaultFormValues.mu?.value);

            // --- FL ---
            this.federatedConfFormGroup
                .get('flInput')
                ?.setValidators([
                    Validators.min(defaultFormValues.fl?.range?.[0]),
                    Validators.max(defaultFormValues.fl?.range?.[1]),
                ]);
            this.federatedConfFormGroup
                .get('flInput')
                ?.setValue(defaultFormValues.fl?.value);

            // --- Momentum ---
            this.federatedConfFormGroup
                .get('momentumInput')
                ?.setValidators([
                    Validators.min(defaultFormValues.momentum?.range?.[0]),
                    Validators.max(defaultFormValues.momentum?.range?.[1]),
                ]);
            this.federatedConfFormGroup
                .get('momentumInput')
                ?.setValue(defaultFormValues.momentum?.value);

            // --- DP y MP ---
            this.federatedConfFormGroup
                .get('dpInput')
                ?.setValue(defaultFormValues.dp?.value);
            this.federatedConfFormGroup
                .get('mpInput')
                ?.setValue(defaultFormValues.mp?.value);

            this.mpOptions = [];
            defaultFormValues.mp?.options?.forEach((option: any) => {
                this.mpOptions.push({ value: option, viewValue: option });
            });

            // --- Noise Mult ---
            this.federatedConfFormGroup
                .get('noiseMultInput')
                ?.setValidators([
                    Validators.min(defaultFormValues.noise_mult?.range?.[0]),
                    Validators.max(defaultFormValues.noise_mult?.range?.[1]),
                ]);
            this.federatedConfFormGroup
                .get('noiseMultInput')
                ?.setValue(defaultFormValues.noise_mult?.value);

            // --- Sampled Clients Num ---
            this.federatedConfFormGroup
                .get('sampledClientsNumInput')
                ?.setValidators([
                    Validators.min(
                        defaultFormValues.sampled_clients?.range?.[0]
                    ),
                    Validators.max(
                        defaultFormValues.sampled_clients?.range?.[1]
                    ),
                ]);
            this.federatedConfFormGroup
                .get('sampledClientsNumInput')
                ?.setValue(defaultFormValues.sampled_clients?.value);

            // --- Clipping Norm ---
            this.federatedConfFormGroup
                .get('clippingNormInput')
                ?.setValidators([
                    Validators.min(defaultFormValues.clip_norm?.range?.[0]),
                    Validators.max(defaultFormValues.clip_norm?.range?.[1]),
                ]);
            this.federatedConfFormGroup
                .get('clippingNormInput')
                ?.setValue(defaultFormValues.clip_norm?.value);

            this.federatedConfFormGroup.updateValueAndValidity();
        }
    }

    metrics: string[] = ['accuracy'];
    protected defaultMetricOptions: SelectOption[] = [
        'accuracy',
        'mse',
        'mae',
        'rmse',
    ].map((m) => ({ value: m, viewValue: m }));

    strategyOptions: any = [];
    mpOptions: any = [];

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'federatedConfForm',
            this.federatedConfFormGroup
        );

        setTimeout(() => {
            this.parentForm.updateValueAndValidity();
        });

        this.federatedConfFormGroup
            .get('strategyOptionsSelect')
            ?.valueChanges.subscribe((strategy) => {
                const muCtrl = this.federatedConfFormGroup.get('muInput');
                const flCtrl = this.federatedConfFormGroup.get('flInput');
                const momentumCtrl =
                    this.federatedConfFormGroup.get('momentumInput');

                muCtrl?.removeValidators(Validators.required);
                flCtrl?.removeValidators(Validators.required);
                momentumCtrl?.removeValidators(Validators.required);

                if (strategy === 'FedProx strategy (FedProx)') {
                    muCtrl?.addValidators(Validators.required);
                } else if (
                    strategy === 'Federated Averaging with Momentum (FedAvgM)'
                ) {
                    flCtrl?.addValidators(Validators.required);
                    momentumCtrl?.addValidators(Validators.required);
                }

                muCtrl?.updateValueAndValidity();
                flCtrl?.updateValueAndValidity();
                momentumCtrl?.updateValueAndValidity();
            });

        this.federatedConfFormGroup
            .get('dpInput')
            ?.valueChanges.subscribe((isDpEnabled) => {
                const dpFields = [
                    'mpInput',
                    'noiseMultInput',
                    'sampledClientsNumInput',
                    'clippingNormInput',
                ];

                dpFields.forEach((field) => {
                    const ctrl = this.federatedConfFormGroup.get(field);
                    if (isDpEnabled) {
                        ctrl?.addValidators(Validators.required);
                    } else {
                        ctrl?.removeValidators(Validators.required);
                    }
                    ctrl?.updateValueAndValidity();
                });
            });
    }

    checkStrategy(): void {
        const strategy = this.federatedConfFormGroup.get(
            'strategyOptionsSelect'
        )?.value;
        const strategies = [
            'Adaptive Federated Optimization (FedOpt)',
            'Federated Optimization with Adam (FedAdam)',
            'Adaptive Federated Optimization using Yogi (FedYogi)',
        ];
        if (strategy && strategies.includes(strategy)) {
            this.showStrategiesInfo = true;
        } else {
            this.showStrategiesInfo = false;
        }
    }

    get strategyHint(): string {
        if (this._showHelp) {
            return this._defaultFormValues.strategy?.description || '';
        }
        if (this.showStrategiesInfo) {
            return this.translate.instant(
                'CATALOG.CONF-FORMS.FLOWER.FEDERATED.NOTE-AGG-STRAT'
            );
        }
        return '';
    }

    getPayload(): TrainModuleRequest['flower'] {
        const v = this.federatedConfFormGroup.getRawValue();
        const strategy = v.strategyOptionsSelect;
        const isDpEnabled = Boolean(v.dpInput);

        return {
            rounds: Number(v.roundsInput),
            metric: Array.isArray(v.metricInput) ? v.metricInput : [],
            min_fit_clients: Number(v.minFitClientsInput),
            min_available_clients: Number(v.minAvailableClientsInput),
            strategy: strategy ?? '',
            dp: isDpEnabled,

            mu:
                strategy === 'FedProx strategy (FedProx)'
                    ? Number(v.muInput)
                    : undefined,
            fl:
                strategy === 'Federated Averaging with Momentum (FedAvgM)'
                    ? Number(v.flInput)
                    : undefined,
            momentum:
                strategy === 'Federated Averaging with Momentum (FedAvgM)'
                    ? Number(v.momentumInput)
                    : undefined,

            mp: isDpEnabled ? (v.mpInput as any) : undefined,
            noise_mult: isDpEnabled ? Number(v.noiseMultInput) : undefined,
            sampled_clients: isDpEnabled
                ? Number(v.sampledClientsNumInput)
                : undefined,
            clip_norm: isDpEnabled ? Number(v.clippingNormInput) : undefined,
        };
    }
}
