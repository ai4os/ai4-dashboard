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
        roundsInput: ['', []],
        metricInput: [['']],
        minFitClientsInput: ['', []],
        minAvailableClientsInput: ['', []],
        strategyOptionsSelect: [''],
        muInput: ['', []],
        flInput: ['', []],
        momentumInput: ['', []],
        dpInput: [false],
        mpInput: [false],
        noiseMultInput: ['', []],
        sampledClientsNumInput: ['', []],
        clippingNormInput: ['', []],
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
                    Validators.min(defaultFormValues.rounds?.range?.[0]),
                    Validators.max(defaultFormValues.rounds?.range?.[1]),
                ]);
            this.federatedConfFormGroup
                .get('roundsInput')
                ?.setValue(defaultFormValues.rounds?.value);
            this.federatedConfFormGroup
                .get('roundsInput')
                ?.updateValueAndValidity();

            // --- Metrics ---
            this.federatedConfFormGroup
                .get('metricInput')
                ?.setValue(defaultFormValues.metric?.value);

            // --- Min Fit Clients ---
            this.federatedConfFormGroup
                .get('minFitClientsInput')
                ?.setValidators([
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
            this.federatedConfFormGroup
                .get('minFitClientsInput')
                ?.updateValueAndValidity();

            // --- Min Available Clients ---
            this.federatedConfFormGroup
                .get('minAvailableClientsInput')
                ?.setValidators([
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
            this.federatedConfFormGroup
                .get('minAvailableClientsInput')
                ?.updateValueAndValidity();

            // --- Strategies ---
            this.federatedConfFormGroup
                .get('strategyOptionsSelect')
                ?.setValue(defaultFormValues.strategy?.value);
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
            this.federatedConfFormGroup
                .get('muInput')
                ?.updateValueAndValidity();

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
            this.federatedConfFormGroup
                .get('flInput')
                ?.updateValueAndValidity();

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
            this.federatedConfFormGroup
                .get('momentumInput')
                ?.updateValueAndValidity();

            // --- DP y MP ---
            this.federatedConfFormGroup
                .get('dpInput')
                ?.setValue(defaultFormValues.dp?.value);
            this.federatedConfFormGroup
                .get('mpInput')
                ?.setValue(defaultFormValues.mp?.value);
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
            this.federatedConfFormGroup
                .get('noiseMultInput')
                ?.updateValueAndValidity();

            // --- Sampled Clients Num ---
            this.federatedConfFormGroup
                .get('sampledClientsNumInput')
                ?.setValidators([
                    Validators.min(
                        defaultFormValues.sampled_clients_num?.range?.[0]
                    ),
                    Validators.max(
                        defaultFormValues.sampled_clients_num?.range?.[1]
                    ),
                ]);
            this.federatedConfFormGroup
                .get('sampledClientsNumInput')
                ?.setValue(defaultFormValues.sampled_clients?.value);
            this.federatedConfFormGroup
                .get('sampledClientsNumInput')
                ?.updateValueAndValidity();

            // --- Clipping Norm ---
            this.federatedConfFormGroup
                .get('clippingNormInput')
                ?.setValidators([
                    Validators.min(defaultFormValues.clipping_norm?.range?.[0]),
                    Validators.max(defaultFormValues.clipping_norm?.range?.[1]),
                ]);
            this.federatedConfFormGroup
                .get('clippingNormInput')
                ?.setValue(defaultFormValues.clip_norm?.value);
            this.federatedConfFormGroup
                .get('clippingNormInput')
                ?.updateValueAndValidity();
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
                'CATALOG.MODULE-TRAIN.FEDERATED-CONF-FORM.NOTE-AGG-STRAT'
            );
        }
        return '';
    }
}
