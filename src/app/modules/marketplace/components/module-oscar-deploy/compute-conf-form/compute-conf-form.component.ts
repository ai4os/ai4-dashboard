import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService } from '@modules/marketplace/services/modules-service/modules.service';
import { Service } from '@app/shared/interfaces/module.interface';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'app-compute-conf-form',
    templateUrl: './compute-conf-form.component.html',
    styleUrls: ['./compute-conf-form.component.scss'],
})
export class ComputeConfFormComponent implements OnInit {
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

    computeConfigFormGroup = this.fb.group({
        cpuInput: [
            '',
            [Validators.required, Validators.max(99), Validators.min(1)],
        ],
        cpuTotalInput: [
            '',
            [Validators.required, Validators.max(99), Validators.min(1)],
        ],
        memoryInput: ['', [Validators.required, Validators.maxLength(6)]],
        memoryTotalInput: ['', [Validators.required, Validators.maxLength(6)]],
        enableGpu: [false],
        logLevel: ['CRITICAL'],
    });

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: Service) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
        }
    }

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'computeConfigForm',
            this.computeConfigFormGroup
        );
    }
}
