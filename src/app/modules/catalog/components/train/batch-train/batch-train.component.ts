import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
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
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    ModuleStorageConfiguration,
    ModuleConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import { TranslateService } from '@ngx-translate/core';
import {
    ShowGeneralFormField,
    GeneralConfFormComponent,
} from '../../conf-forms/general-conf-form/general-conf-form.component';
import { StepperFormComponent } from '../stepper-form/stepper-form.component';
import { HardwareConfFormComponent } from '../../conf-forms/hardware-conf-form/hardware-conf-form.component';
import { StorageConfFormComponent } from '../../conf-forms/storage-conf-form/storage-conf-form.component';
import { MatDivider } from '@angular/material/divider';
import { BatchConfFormComponent } from '../../conf-forms/batch-conf-form/batch-conf-form.component';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';

@Component({
    selector: 'app-batch-train',
    templateUrl: './batch-train.component.html',
    styleUrl: './batch-train.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
        StorageConfFormComponent,
        MatDivider,
        BatchConfFormComponent,
    ],
})
export class BatchTrainComponent implements OnInit {
    private readonly _formBuilder = inject(FormBuilder);
    private readonly modulesService = inject(ModulesService);
    translateService = inject(TranslateService);
    deploymentsService = inject(DeploymentsService);
    snackbarService = inject(SnackbarService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    constructor() {
        const navigation = this.router.currentNavigation();
        this.service =
            navigation?.extras?.state?.['service'] ||
            history.state?.['service'];
    }

    title = '';
    step1Title = 'CATALOG.CONF-FORMS.GENERAL.TITLE';
    step2Title = 'CATALOG.CONF-FORMS.HARDWARE.TITLE';
    step3Title = 'CATALOG.CONF-FORMS.DATA.TITLE';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    batchConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    storageConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    storageConfDefaultValues!: ModuleStorageConfiguration;

    @ViewChild(GeneralConfFormComponent)
    generalConfFormCmp!: GeneralConfFormComponent;
    @ViewChild(HardwareConfFormComponent)
    hardwareConfFormCmp!: HardwareConfFormComponent;
    @ViewChild(StorageConfFormComponent)
    storageConfFormCmp!: StorageConfFormComponent;
    @ViewChild(BatchConfFormComponent)
    batchConfFormCmp!: BatchConfFormComponent;

    showGeneralFields: ShowGeneralFormField = {
        titleInput: true,
        descriptionInput: true,
        co2EmissionsInput: false,
        serviceToRunChip: false,
        serviceToRunPassInput: false,
        dockerImageInput: true,
        dockerTagSelect: true,
        infoButton: false,
    };

    service: string | undefined;
    warningMessage = '';

    ngOnInit(): void {
        const deploymentType = sessionStorage.getItem('deploymentType');
        if (deploymentType && deploymentType === 'snapshot') {
            this.title = 'Snapshots';
            sessionStorage.removeItem('deploymentType');
            this.loadGenericModule();
        } else {
            this.loadSpecificModule();
        }
    }

    loadGenericModule() {
        this.showLoader = true;
        this.modulesService
            .getModuleNomadConfiguration('ai4os-demo-app')
            .subscribe((moduleConf: ModuleConfiguration) => {
                this.generalConfDefaultValues = moduleConf.general;
                this.hardwareConfDefaultValues = moduleConf.hardware;
                this.storageConfDefaultValues = moduleConf.storage;

                if (this.service) {
                    this.generalConfDefaultValues.service.value = this.service;
                }

                const deploymentRow = sessionStorage.getItem('deploymentRow');
                if (deploymentRow) {
                    const deployment = JSON.parse(deploymentRow);
                    const snapshotText =
                        this.translateService.instant(
                            'CATALOG.MODULE-TRAIN.GENERAL-CONF-FORM.SNAPSHOT-ID'
                        ) + deployment.snapshot_ID;
                    this.generalConfDefaultValues.title.value = deployment.name;
                    this.generalConfDefaultValues.desc!.value = deployment.desc
                        ? deployment.desc + '\n' + snapshotText
                        : snapshotText;
                    this.generalConfDefaultValues.docker_image.value =
                        deployment.containerName;
                    this.generalConfDefaultValues.docker_tag.options = [
                        deployment.tagName,
                    ];
                    this.generalConfDefaultValues.docker_tag.value =
                        deployment.tagName;
                }

                // Check if config has a warning
                if (
                    this.hardwareConfDefaultValues.warning &&
                    this.hardwareConfDefaultValues.warning !== ''
                ) {
                    this.warningMessage =
                        this.hardwareConfDefaultValues.warning;
                }

                this.showLoader = false;
            });
    }

    loadSpecificModule() {
        this.route.parent?.params.subscribe((params) => {
            this.showLoader = true;
            this.modulesService.getModule(params['id']).subscribe((module) => {
                this.title = module.title;
                this.modulesService
                    .getModuleNomadConfiguration(params['id'])
                    .subscribe((moduleConf: ModuleConfiguration) => {
                        this.generalConfDefaultValues = moduleConf.general;
                        this.hardwareConfDefaultValues = moduleConf.hardware;
                        this.storageConfDefaultValues = moduleConf.storage;

                        if (this.service) {
                            this.generalConfDefaultValues.service.value =
                                this.service;
                        }
                        // Check if config has a warning
                        if (
                            this.hardwareConfDefaultValues.warning &&
                            this.hardwareConfDefaultValues.warning !== ''
                        ) {
                            this.warningMessage =
                                this.hardwareConfDefaultValues.warning;
                        }

                        this.showLoader = false;
                    });
            });
        });
    }

    showHelpButtonChange(checked: boolean) {
        this.showHelp = checked;
    }

    onSubmit(): void {
        this.showLoader = true;

        const request: TrainModuleRequest = {
            general: this.generalConfFormCmp.getPayload(),
            hardware: this.hardwareConfFormCmp.getPayload(),
            storage: this.storageConfFormCmp.getPayload(),
        };

        const batchFile = this.batchConfFormCmp.getBatchFile();

        this.deploymentsService
            .postBatchDeployment(request, batchFile)
            .subscribe({
                next: (result) => this.handleSuccess(result),
                error: () => (this.showLoader = false),
            });
    }

    private handleSuccess(result: StatusReturn): void {
        this.showLoader = false;
        if (result?.status === 'success') {
            this.router.navigate(['/tasks/batch']).then((navigated) => {
                if (navigated) {
                    this.snackbarService.openSuccess(
                        'Batch deployment created with ID ' + result.job_ID
                    );
                }
            });
        } else if (result?.status === 'fail') {
            this.snackbarService.openError(
                'Error while creating the batch deployment ' + result.error_msg
            );
        }
    }
}
