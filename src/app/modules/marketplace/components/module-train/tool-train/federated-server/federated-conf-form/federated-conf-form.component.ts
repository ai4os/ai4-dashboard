import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-federated-conf-form',
    templateUrl: './federated-conf-form.component.html',
    styleUrls: ['./federated-conf-form.component.scss'],
})
export class FederatedConfFormComponent implements OnInit {
    constructor(
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder
    ) {
        this.filteredMetrics = this.metricCtrl.valueChanges.pipe(
            startWith(null),
            map((metric: string | null) =>
                metric ? this._filter(metric) : this.defaultMetrics.slice()
            )
        );
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
        minClientsInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.min_clients.range[0]),
                Validators.max(this.defaultFormValues?.min_clients.range[1]),
            ],
        ],
        strategyOptionsSelect: [''],
    });

    protected _defaultFormValues: any;

    protected _showHelp = false;

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
                .get('minClientsInput')
                ?.setValue(defaultFormValues.min_clients?.value);
            this.federatedConfFormGroup
                .get('strategyOptionsSelect')
                ?.setValue(defaultFormValues.strategy?.value);
            defaultFormValues.strategy?.options?.forEach((option: any) => {
                this.strategyOptions.push({
                    value: option,
                    viewValue: option,
                });
            });
        }
    }

    separatorKeysCodes: number[] = [ENTER, COMMA];
    addOnBlur = true;

    metricCtrl = new FormControl('');
    filteredMetrics: Observable<string[]>;
    metrics: string[] = ['accuracy'];
    defaultMetrics: string[] = ['accuracy', 'mse', 'mae', 'rmse'];

    strategyOptions: any = [];

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'federatedConfForm',
            this.federatedConfFormGroup
        );
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
