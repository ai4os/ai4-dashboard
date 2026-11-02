import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    GeneralConfFormComponent,
    ShowGeneralFormField,
} from '../../../conf-forms/general-conf-form/general-conf-form.component';
import {
    HardwareConfFormComponent,
    ShowHardwareField,
} from '../../../conf-forms/hardware-conf-form/hardware-conf-form.component';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    TrainModuleRequest,
    FederatedSimulationLlmConfiguration,
    FederatedLlmSimulationToolConfiguration,
    ModuleStorageConfiguration,
} from '@app/shared/interfaces/module.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';
import { FederatedSimulationConfFormComponent } from '../../../conf-forms/federated-simulation-conf-form/federated-simulation-conf-form.component';
import { StorageConfFormComponent } from '../../../conf-forms/storage-conf-form/storage-conf-form.component';

@Component({
    selector: 'app-arena-simulation-fedllm',
    imports: [
        HardwareConfFormComponent,
        GeneralConfFormComponent,
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        FederatedSimulationConfFormComponent,
        StorageConfFormComponent,
    ],
    templateUrl: './arena-simulation-fedllm.component.html',
    styleUrl: './arena-simulation-fedllm.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class ArenaSimulationFedllmComponent implements OnInit {
    _formBuilder = inject(FormBuilder);
    route = inject(ActivatedRoute);
    toolsService = inject(ToolsService);
    deploymentsService = inject(DeploymentsService);
    snackbarService = inject(SnackbarService);
    router = inject(Router);

    title = '';
    step1Title = 'CATALOG.CONF-FORMS.GENERAL.TITLE';
    step2Title = 'CATALOG.CONF-FORMS.HARDWARE.TITLE';
    step3Title = 'CATALOG.CONF-FORMS.DATA.TITLE';
    step4Title = 'CATALOG.CONF-FORMS.FED-LLM.TITLE';

    showHelp = false;
    showLoader = false;
    warningMessage = '';

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    storageConfForm: FormGroup = this._formBuilder.group({});
    federatedConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    storageConfDefaultValues!: ModuleStorageConfiguration;
    federatedConfDefaultValues!: FederatedSimulationLlmConfiguration;

    showHardwareFields: ShowHardwareField = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: true,
        gpu_type: true,
    };

    showGeneralFields: ShowGeneralFormField = {
        descriptionInput: true,
        serviceToRunChip: true,
        titleInput: true,
        co2EmissionsInput: false,
        serviceToRunPassInput: true,
        dockerImageInput: true,
        dockerTagSelect: false,
        infoButton: false,
    };

    @ViewChild(GeneralConfFormComponent)
    generalConfFormCmp!: GeneralConfFormComponent;
    @ViewChild(HardwareConfFormComponent)
    hardwareConfFormCmp!: HardwareConfFormComponent;
    @ViewChild(StorageConfFormComponent)
    storageConfFormCmp!: StorageConfFormComponent;
    @ViewChild(FederatedSimulationConfFormComponent)
    federatedConfFormCmp!: FederatedSimulationConfFormComponent;

    ngOnInit(): void {
        this.loadModule();
    }

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.showLoader = true;
            this.toolsService.getTool(params['id']).subscribe((tool) => {
                this.title = tool.title;
            });
            this.toolsService
                .getFederatedSimulationConfiguration(params['id'])
                .subscribe(
                    (moduleConf: FederatedLlmSimulationToolConfiguration) => {
                        this.generalConfDefaultValues = moduleConf.general;
                        this.hardwareConfDefaultValues = moduleConf.hardware;
                        this.storageConfDefaultValues = moduleConf.storage;
                        this.federatedConfDefaultValues =
                            moduleConf.fed_llm_simulation;

                        // Check if config has a warning
                        if (
                            this.hardwareConfDefaultValues.warning &&
                            this.hardwareConfDefaultValues.warning !== ''
                        ) {
                            this.warningMessage =
                                this.hardwareConfDefaultValues.warning;
                        }

                        this.showLoader = false;
                    }
                );
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
            fed_llm_simulation: this.federatedConfFormCmp.getPayload(),
        };

        this.deploymentsService
            .trainTool('arena-simulation-fedllm', request)
            .subscribe({
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
