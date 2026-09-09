import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    ModuleGeneralConfiguration,
    ModuleStorageConfiguration,
    CvatToolConfiguration,
    CvatConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import {
    ShowGeneralFormField,
    GeneralConfFormComponent,
} from '../../../conf-forms/general-conf-form/general-conf-form.component';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';
import { StorageConfFormComponent } from '../../../conf-forms/storage-conf-form/storage-conf-form.component';
import { CvatConfFormComponent } from '../../../conf-forms/cvat-conf-form/cvat-conf-form.component';
import { MatDivider } from '@angular/material/divider';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

@Component({
    selector: 'app-cvat',
    templateUrl: './cvat.component.html',
    styleUrl: './cvat.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        StorageConfFormComponent,
        CvatConfFormComponent,
        MatDivider,
    ],
})
export class CvatComponent implements OnInit {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly toolsService = inject(ToolsService);
    private readonly deploymentsService = inject(DeploymentsService);
    private readonly router = inject(Router);

    private readonly snackbarService = inject(SnackbarService);

    title = '';
    step1Title = 'CATALOG.CONF-FORMS.GENERAL.TITLE';
    step2Title = 'CATALOG.CONF-FORMS.DATA.TITLE';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    cvatConfForm: FormGroup = this._formBuilder.group({});
    storageConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    cvatConfDefaultValues!: CvatConfiguration;
    storageConfDefaultValues!: ModuleStorageConfiguration;

    @ViewChild(GeneralConfFormComponent)
    generalConfFormCmp!: GeneralConfFormComponent;
    @ViewChild(CvatConfFormComponent) cvatConfFormCmp!: CvatConfFormComponent;
    @ViewChild(StorageConfFormComponent)
    storageConfFormCmp!: StorageConfFormComponent;

    showGeneralFields: ShowGeneralFormField = {
        titleInput: true,
        descriptionInput: true,
        co2EmissionsInput: false,
        serviceToRunChip: false,
        serviceToRunPassInput: false,
        dockerImageInput: false,
        dockerTagSelect: false,
        infoButton: true,
        cvatFields: true,
        ai4lifeFields: false,
        batchFields: false,
    };

    ngOnInit(): void {
        this.loadModule();
    }

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.toolsService.getTool(params['id']).subscribe((cvat) => {
                this.title = cvat.title;
            });
            this.toolsService
                .getCvatConfiguration(params['id'])
                .subscribe((toolConf: CvatToolConfiguration) => {
                    this.generalConfDefaultValues = toolConf.general;
                    this.cvatConfDefaultValues = {
                        ...this.cvatConfDefaultValues,
                        username: toolConf.general.cvat_username!,
                        password: toolConf.general.cvat_password!,
                    };
                    this.storageConfDefaultValues = toolConf.storage;
                });
        });
    }

    showHelpButtonChange(checked: boolean) {
        this.showHelp = checked;
    }

    onSubmit(): void {
        this.showLoader = true;
        const request: TrainModuleRequest = {
            general: {
                ...this.generalConfFormCmp.getPayload(),
                ...this.cvatConfFormCmp.getPayload(),
            },
            storage: this.storageConfFormCmp.getPayload(),
        };

        this.deploymentsService.trainTool('ai4os-cvat', request).subscribe({
            next: (result) => this.handleSuccess(result),
            error: () => (this.showLoader = false),
        });
    }

    private handleSuccess(result: StatusReturn): void {
        this.showLoader = false;
        if (result?.status === 'success') {
            this.router.navigate(['/tasks/deployments']).then((navigated) => {
                if (navigated) {
                    this.snackbarService.openSuccess(
                        'Deployment created with ID ' + result.job_ID
                    );
                }
            });
        } else if (result?.status === 'fail') {
            this.snackbarService.openError(
                'Error while creating the deployment ' + result.error_msg
            );
        }
    }
}
