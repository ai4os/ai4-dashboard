import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    KafkaServerToolConfiguration,
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import { showHardwareField } from '../../hardware-conf-form/hardware-conf-form.component';
import { showGeneralFormField } from '../../general-conf-form/general-conf-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/marketplace/services/tools-service/tools.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { statusReturn } from '@app/shared/interfaces/deployment.interface';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-kafka-server',
    templateUrl: './kafka-server.component.html',
    styleUrls: ['./kafka-server.component.scss'],
})
export class KafkaServerComponent {
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

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;

    showGeneralFields: showGeneralFormField = {
        descriptionInput: true,
        serviceToRunChip: false,
        titleInput: true,
        serviceToRunPassInput: false,
        dockerImageInput: true,
        dockerTagSelect: true,
        hostnameInput: true,
        federated_secret: true,
        infoButton: true,
    };

    showHardwareFields: showHardwareField = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: false,
        gpu_type: false,
        instances_num: true,
    };

    ngOnInit(): void {
        this.loadModule();
    }

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.toolsService.getTool(params['id']).subscribe((kafkaServer) => {
                this.title = kafkaServer.title;
            });
            this.toolsService
                .getFederatedServerConfiguration(params['id'])
                .subscribe((moduleConf: KafkaServerToolConfiguration) => {
                    this.generalConfDefaultValues = moduleConf.general;
                    this.hardwareConfDefaultValues = moduleConf.hardware;
                    console.log(moduleConf.hardware);
                    console.log(this.hardwareConfDefaultValues);
                });
        });
    }

    submitTrainingRequest() {
        this.showLoader = true;

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
                hostname:
                    this.generalConfForm.getRawValue().generalConfForm
                        .hostnameInput,
                federated_secret:
                    this.generalConfForm.getRawValue().generalConfForm
                        .federatedSecretInput,
            },
            hardware: {
                cpu_num:
                    this.hardwareConfForm.value.hardwareConfForm.cpuNumberInput,
                ram: this.hardwareConfForm.value.hardwareConfForm
                    .ramMemoryInput,
                disk: this.hardwareConfForm.value.hardwareConfForm
                    .diskMemoryInput,
                instance_num:
                    this.hardwareConfForm.value.hardwareConfForm.instance_num,
            },
        };
        console.log(request);
        this.deploymentsService.trainTool(request).subscribe({
            next: (result: statusReturn) => {
                this.showLoader = false;
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
            error: () => {
                this.showLoader = false;
            },
            complete: () => {
                this.showLoader = false;
            },
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }

    isLoading(): boolean {
        return this.showLoader;
    }
}
