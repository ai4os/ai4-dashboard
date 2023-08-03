import { Component, Input } from '@angular/core';
import {
    FormGroupDirective,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-federated-conf-form',
    templateUrl: './federated-conf-form.component.html',
    styleUrls: ['./federated-conf-form.component.scss'],
})
export class FederatedConfFormComponent {
    constructor(
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder
    ) {}

    parentForm!: FormGroup;

    federatedConfFormGroup = this.fb.group({
        roundsInput: [
            '',
            [
                Validators.min(this.defaultFormValues?.rounds.range[0]),
                Validators.max(this.defaultFormValues?.rounds.range[1]),
            ],
        ],
        metricInput: [''],
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

    strategyOptions: any = [];

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'federatedConfForm',
            this.federatedConfFormGroup
        );
    }
}
