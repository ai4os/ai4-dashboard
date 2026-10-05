import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    TrainModuleRequest,
    FederatedServerLlmConfiguration,
    FederatedLlmServerToolConfiguration,
} from '@app/shared/interfaces/module.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    GeneralConfFormComponent,
    ShowGeneralFormField,
} from '../../../conf-forms/general-conf-form/general-conf-form.component';
import {
    HardwareConfFormComponent,
    ShowHardwareField,
} from '../../../conf-forms/hardware-conf-form/hardware-conf-form.component';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';
import { FederatedLlmConfFormComponent } from '../../../conf-forms/federated-llm-conf-form/federated-llm-conf-form.component';

@Component({
    selector: 'app-arena-fl-server-llm',
    templateUrl: './arena-fl-server-llm.component.html',
    styleUrl: './arena-fl-server-llm.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
        FederatedLlmConfFormComponent,
    ],
})
export class ArenaFlServerLlmComponent implements OnInit {
    _formBuilder = inject(FormBuilder);
    route = inject(ActivatedRoute);
    toolsService = inject(ToolsService);
    deploymentsService = inject(DeploymentsService);
    snackbarService = inject(SnackbarService);
    router = inject(Router);

    title = '';
    step1Title = 'CATALOG.CONF-FORMS.GENERAL.TITLE';
    step2Title = 'CATALOG.CONF-FORMS.HARDWARE.TITLE';
    step3Title = 'CATALOG.CONF-FORMS.FED-LLM.TITLE';

    showHelp = false;
    showLoader = false;
    warningMessage = '';

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    federatedConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    federatedConfDefaultValues!: FederatedServerLlmConfiguration;

    showHardwareFields: ShowHardwareField = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: false,
        gpu_type: false,
    };

    showGeneralFields: ShowGeneralFormField = {
        titleInput: true,
        descriptionInput: true,
        serviceToRunChip: true,
        co2EmissionsInput: true,
        serviceToRunPassInput: true,
        dockerImageInput: true,
        dockerTagSelect: false,
        infoButton: true,
    };

    @ViewChild(GeneralConfFormComponent)
    generalConfFormCmp!: GeneralConfFormComponent;
    @ViewChild(HardwareConfFormComponent)
    hardwareConfFormCmp!: HardwareConfFormComponent;
    @ViewChild(FederatedLlmConfFormComponent)
    federatedConfFormCmp!: FederatedLlmConfFormComponent;

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
                .getFederatedLlmServerConfiguration(params['id'])
                .subscribe((toolConf: FederatedLlmServerToolConfiguration) => {
                    this.generalConfDefaultValues = toolConf.general;
                    this.hardwareConfDefaultValues = toolConf.hardware;
                    this.federatedConfDefaultValues = toolConf.fedllm;

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
    }

    showHelpButtonChange(checked: boolean) {
        this.showHelp = checked;
    }

    onSubmit(): void {
        this.showLoader = true;
        const request: TrainModuleRequest = {
            general: this.generalConfFormCmp.getPayload(),
            hardware: this.hardwareConfFormCmp.getPayload(),
            fedllm: this.federatedConfFormCmp.getPayload(),
        };

        this.deploymentsService
            .trainTool('arena-fl-server-llm', request)
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
