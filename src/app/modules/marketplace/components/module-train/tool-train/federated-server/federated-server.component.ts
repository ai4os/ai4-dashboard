import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/marketplace/services/tools-service/tools.service';
import {
    FederatedServerConfiguration,
    FederatedServerToolConfiguration,
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import { showHardwareField } from '../../hardware-conf-form/hardware-conf-form.component';
import { showGeneralFormField } from '../../general-conf-form/general-conf-form.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeploymentsService } from '@app/modules/deployments/services/deployments.service';
import { statusReturn } from '@app/shared/interfaces/deployment.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-federated-server',
    templateUrl: './federated-server.component.html',
    styleUrls: ['./federated-server.component.scss'],
})
export class FederatedServerComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private toolsService: ToolsService,
        private deploymentsService: DeploymentsService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    title = '';
    step1Title = 'MODULES.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'MODULES.MODULE-TRAIN.HARDWARE-CONF';
    step3Title = 'MODULES.MODULE-TRAIN.FEDERATED-CONF';

    showHelp = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    federatedConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    federatedConfDefaultValues!: FederatedServerConfiguration;

    showHardwareFields: showHardwareField = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: false,
        gpu_type: false,
    };

    showGeneralFields: showGeneralFormField = {
        descriptionInput: true,
        serviceToRunChip: true,
        titleInput: true,
        serviceToRunPassInput: true,
        dockerImageInput: true,
        dockerTagSelect: true,
        hostnameInput: true,
        federated_secret: true,
    };

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.toolsService
                .getTool(params['id'])
                .subscribe((federatedServer) => {
                    this.title = federatedServer.title;
                });
            this.toolsService
                .getFederatedServerConfiguration(params['id'])
                .subscribe((moduleConf: FederatedServerToolConfiguration) => {
                    this.generalConfDefaultValues = moduleConf.general;
                    this.hardwareConfDefaultValues = moduleConf.hardware;
                    this.federatedConfDefaultValues = moduleConf.configuration;
                });
        });
    }

    submitTrainingRequest() {
        const request: TrainModuleRequest = {
            general: {
                title: this.generalConfForm.value.generalConfForm.titleInput,
                desc: this.generalConfForm.value.generalConfForm
                    .descriptionInput,
                docker_image:
                    this.generalConfForm.getRawValue().generalConfForm
                        .dockerImageInput,
                docker_tag:
                    this.generalConfForm.value.generalConfForm.dockerTagSelect,
                service:
                    this.generalConfForm.value.generalConfForm.serviceToRunChip,
                jupyter_password:
                    this.generalConfForm.getRawValue().generalConfForm
                        .jupyterLabPassInput,
                hostname:
                    this.generalConfForm.getRawValue().generalConfForm
                        .hostnameInput,
            },
            hardware: {
                cpu_num:
                    this.hardwareConfForm.value.hardwareConfForm.cpuNumberInput,
                ram: this.hardwareConfForm.value.hardwareConfForm
                    .ramMemoryInput,
                disk: this.hardwareConfForm.value.hardwareConfForm
                    .diskMemoryInput,
                gpu_num:
                    this.hardwareConfForm.value.hardwareConfForm.gpuNumberInput,
                gpu_type:
                    this.hardwareConfForm.value.hardwareConfForm.gpuModelSelect,
            },
            configuration: {
                rounds: this.federatedConfForm.value.federatedConfForm
                    .roundsInput,
                metric: this.federatedConfForm.value.federatedConfForm
                    .metricInput,
                min_clients:
                    this.federatedConfForm.value.federatedConfForm
                        .minClientsInput,
                strategy:
                    this.federatedConfForm.value.federatedConfForm
                        .strategyOptionsSelect,
            },
        };

        this.deploymentsService.trainTool(request).subscribe({
            next: (result: statusReturn) => {
                if (result && result.status == 'success') {
                    this.router
                        .navigate(['/deployments'])
                        .then((navigated: boolean) => {
                            if (navigated) {
                                this._snackBar.open(
                                    'Deployment created with ID' +
                                        result.job_ID,
                                    'X',
                                    {
                                        duration: 3000,
                                        panelClass: ['primary-snackbar'],
                                    }
                                );
                            }
                        });
                } else {
                    if (result && result.status == 'fail') {
                        this._snackBar.open(
                            'Error while creating the deployment' +
                                result.error_msg,
                            'X',
                            {
                                duration: 3000,
                                panelClass: ['red-snackbar'],
                            }
                        );
                    }
                }
            },
        });
    }
    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }

    ngOnInit(): void {
        this.loadModule();
    }
}
