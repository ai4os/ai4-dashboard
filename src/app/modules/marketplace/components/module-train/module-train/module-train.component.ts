import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ModuleConfiguration,
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    ModuleStorageConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import { statusReturn } from '@app/shared/interfaces/deployment.interface';
import { ModulesService } from '@app/modules/marketplace/services/modules-service/modules.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-module-train',
    templateUrl: './module-train.component.html',
    styleUrls: ['./module-train.component.scss'],
})
export class ModuleTrainComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private modulesService: ModulesService,
        private deploymentsService: DeploymentsService,
        private route: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private router: Router
    ) {}

    title = '';
    step1Title = 'MODULES.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'MODULES.MODULE-TRAIN.HARDWARE-CONF';
    step3Title = 'MODULES.MODULE-TRAIN.STORAGE-CONF';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    storageConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    storageConfDefaultValues!: ModuleStorageConfiguration;

    ngOnInit(): void {
        this.loadModule();
    }

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.modulesService.getModule(params['id']).subscribe((module) => {
                this.title = module.title;
            });
            this.modulesService
                .getModuleConfiguration(params['id'])
                .subscribe((moduleConf: ModuleConfiguration) => {
                    this.generalConfDefaultValues = moduleConf.general;
                    this.hardwareConfDefaultValues = moduleConf.hardware;
                    this.storageConfDefaultValues = moduleConf.storage;
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
                service:
                    this.generalConfForm.value.generalConfForm.serviceToRunChip,
                jupyter_password:
                    this.generalConfForm.getRawValue().generalConfForm
                        .serviceToRunPassInput,
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
            storage: {
                rclone_conf:
                    this.storageConfForm.value.storageConfForm.rcloneConfInput,
                rclone_url:
                    this.storageConfForm.value.storageConfForm.storageUrlInput,
                rclone_vendor:
                    this.storageConfForm.value.storageConfForm
                        .rcloneVendorSelect,
                rclone_user:
                    this.storageConfForm.value.storageConfForm.rcloneUserInput,
                rclone_password:
                    this.storageConfForm.value.storageConfForm
                        .rclonePasswordInput,
            },
        };

        this.deploymentsService.postTrainModule(request).subscribe({
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
                                        panelClass: ['success-snackbar'],
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
}
