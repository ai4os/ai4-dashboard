import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
    selector: 'app-federated-conf-form',
    templateUrl: './federated-conf-form.component.html',
    styleUrls: ['./federated-conf-form.component.scss'],
})
export class FederatedConfFormComponent implements OnInit {
    constructor(
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.filteredMetrics = this.metricCtrl.valueChanges.pipe(
            startWith(null),
            map((metric: string | null) =>
                metric ? this._filter(metric) : this.defaultMetrics.slice()
            )
        );
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    parentForm!: FormGroup;

    federatedConfFormGroup = this.fb.group({
        roundsInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.rounds.range[0]),
                Validators.max(this.defaultFormValues?.rounds.range[1]),
            ],
        ],
        metricInput: [['']],
        minFitClientsInput: [
            '',
            [
                Validators.min(
                    this.defaultFormValues?.min_fit_clients.range[0]
                ),
                Validators.max(
                    this.defaultFormValues?.min_fit_clients.range[1]
                ),
            ],
        ],
        minAvailableClientsInput: [
            '',
            [
                Validators.min(
                    this.defaultFormValues?.min_available_clients.range[0]
                ),
                Validators.max(
                    this.defaultFormValues?.min_available_clients.range[1]
                ),
            ],
        ],
        strategyOptionsSelect: [''],
        muInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.mu.range[0]),
                Validators.max(this.defaultFormValues?.mu.range[1]),
            ],
        ],
        flInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.fl.range[0]),
                Validators.max(this.defaultFormValues?.fl.range[1]),
            ],
        ],
        momentumInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.momentum.range[0]),
                Validators.max(this.defaultFormValues?.momentum.range[1]),
            ],
        ],
        dpInput: false,
        mpInput: false,
        noiseMultInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.noise_mult.range[0]),
                Validators.max(this.defaultFormValues?.noise_mult.range[1]),
            ],
        ],
        sampledClientsNumInput: [
            '',
            [
                Validators.min(
                    this.defaultFormValues?.sampled_clients_num.range[0]
                ),
                Validators.max(
                    this.defaultFormValues?.sampled_clients_num.range[1]
                ),
            ],
        ],
        clippingNormInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.clipping_norm.range[0]),
                Validators.max(this.defaultFormValues?.clipping_norm.range[1]),
            ],
        ],
    });

    protected _defaultFormValues: any;

    protected _showHelp = false;
    protected showStrategiesInfo = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    @Input() set showHelp(showHelp: any) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: any) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.federatedConfFormGroup
                .get('roundsInput')
                ?.setValue(defaultFormValues.rounds?.value);
            this.federatedConfFormGroup
                .get('metricInput')
                ?.setValue(defaultFormValues.metric?.value);
            this.federatedConfFormGroup
                .get('minFitClientsInput')
                ?.setValue(defaultFormValues.min_fit_clients?.value);
            this.federatedConfFormGroup
                .get('minAvailableClientsInput')
                ?.setValue(defaultFormValues.min_available_clients?.value);
            this.federatedConfFormGroup
                .get('strategyOptionsSelect')
                ?.setValue(defaultFormValues.strategy?.value);
            defaultFormValues.strategy?.options?.forEach((option: any) => {
                this.strategyOptions.push({
                    value: option,
                    viewValue: option,
                });
            });
            this.federatedConfFormGroup
                .get('muInput')
                ?.setValue(defaultFormValues.mu?.value);
            this.federatedConfFormGroup
                .get('flInput')
                ?.setValue(defaultFormValues.fl?.value);
            this.federatedConfFormGroup
                .get('momentumInput')
                ?.setValue(defaultFormValues.momentum?.value);
            this.federatedConfFormGroup
                .get('dpInput')
                ?.setValue(defaultFormValues.dp?.value);
            this.federatedConfFormGroup
                .get('mpInput')
                ?.setValue(defaultFormValues.mp?.value);
            defaultFormValues.mp?.options?.forEach((option: any) => {
                this.mpOptions.push({
                    value: option,
                    viewValue: option,
                });
            });
            this.federatedConfFormGroup
                .get('noiseMultInput')
                ?.setValue(defaultFormValues.noise_mult?.value);
            this.federatedConfFormGroup
                .get('sampledClientsNumInput')
                ?.setValue(defaultFormValues.sampled_clients?.value);
            this.federatedConfFormGroup
                .get('clippingNormInput')
                ?.setValue(defaultFormValues.clip_norm?.value);
        }
    }

    separatorKeysCodes: number[] = [ENTER, COMMA];
    addOnBlur = true;

    metricCtrl = new FormControl('');
    filteredMetrics: Observable<string[]>;
    metrics: string[] = ['accuracy'];
    defaultMetrics: string[] = ['accuracy', 'mse', 'mae', 'rmse'];
    strategyOptions: any = [];
    mpOptions: any = [];

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'federatedConfForm',
            this.federatedConfFormGroup
        );
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

    openDocumentationWeb(): void {
        const url =
            'https://docs.ai4eosc.eu/en/latest/howtos/train/federated-server.html';
        window.open(url);
    }

    // Chip Input Functions
    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value && !this.metrics.includes(value)) {
            this.metrics.push(value);
            this.federatedConfFormGroup
                .get('metricInput')
                ?.setValue(this.metrics);
        }

        event.chipInput!.clear();
        this.metricCtrl.setValue(null);
    }

    remove(input: string): void {
        const index = this.metrics.indexOf(input);

        if (index >= 0) {
            this.metrics.splice(index, 1);
            this.federatedConfFormGroup
                .get('metricInput')
                ?.setValue(this.metrics);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        if (!this.metrics.includes(event.option.viewValue)) {
            this.metrics.push(event.option.viewValue);
            this.federatedConfFormGroup
                .get('metricInput')
                ?.setValue(this.metrics);
        }
        this.metricCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.defaultMetrics.filter((metric) =>
            metric.toLowerCase().includes(filterValue)
        );
    }
}
