import { MediaMatcher } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { OscarInferenceService } from '@app/modules/inference/services/oscar-inference.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { Observable } from 'rxjs';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

@Component({
    selector: 'app-stepper-form',
    templateUrl: './stepper-form.component.html',
    styleUrls: ['./stepper-form.component.scss'],
})
export class StepperFormComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private deploymentsService: DeploymentsService,
        private oscarInferenceService: OscarInferenceService,
        private router: Router,
        private snackbarService: SnackbarService
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.cdr.detectChanges();

        // scroll to top
        setTimeout(() => {
            const content = document.querySelector(
                '.sidenav-content'
            ) as HTMLElement;
            if (content) {
                content.scrollTop = 0;
            }
        }, 100);
    }

    @Input() title!: string;
    @Input() numberOfSteps!: number;
    @Input() step1!: TemplateRef<unknown>;
    @Input() step2!: TemplateRef<unknown>;
    @Input() step3!: TemplateRef<unknown>;
    @Input() step1Form!: FormGroup;
    @Input() step2Form!: FormGroup;
    @Input() step3Form?: FormGroup;
    @Input() step1Title!: string;
    @Input() step2Title!: string;
    @Input() step3Title?: string;
    @Input() warningMessage?: string = '';
    @Input() platform?: string = 'nomad';
    @Input() isLoading!: boolean;

    @Output() showHelpButtonEvent = new EventEmitter<MatSlideToggleChange>();

    @ViewChild('showHelpToggle', { read: ElementRef }) element:
        | ElementRef
        | undefined;

    showHelpForm: FormGroup = this._formBuilder.group({
        showHelpToggleButton: false,
    });
    isFormValid = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    checkFormValidity(form: FormGroup) {
        if (form) {
            return form.valid;
        }
        return false;
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelpButtonEvent.emit(event);
    }

    submitTrainingRequest() {
        this.isLoading = true;
        if (this.step1Form.value.generalConfForm.batchFile) {
            this.createBatchDeployment();
        } else if (this.platform === 'nomad') {
            this.createNomadService();
        } else {
            this.createOscarService();
        }
    }

    createNomadService() {
        let request: Observable<StatusReturn>;
        const data: TrainModuleRequest = {
            general: {
                title:
                    this.step1Form.value.generalConfForm.titleInput === ''
                        ? uniqueNamesGenerator({
                            dictionaries: [colors, animals],
                        })
                        : this.step1Form.value.generalConfForm.titleInput,
                desc: this.step1Form.value.generalConfForm.descriptionInput,
                co2: this.step1Form.value.generalConfForm.co2EmissionsInput,
                docker_image:
                    this.step1Form.getRawValue().generalConfForm
                        .dockerImageInput,
                docker_tag:
                    this.step1Form.value.generalConfForm.dockerTagSelect,
                service: this.step1Form.value.generalConfForm.serviceToRunChip,
                jupyter_password:
                    this.step1Form.getRawValue().generalConfForm
                        .serviceToRunPassInput,
                cvat_username:
                    this.step1Form.getRawValue().generalConfForm
                        .cvatUsernameInput,
                cvat_password:
                    this.step1Form.getRawValue().generalConfForm
                        .cvatPasswordInput,
                model_id: this.step1Form.value.generalConfForm.modelIdSelect,
            },
        };

        if (this.title == 'CVAT Image Annotation') {
            data.storage = {
                rclone_conf:
                    this.step2Form.value.storageConfForm.rcloneConfInput,
                rclone_url:
                    this.step2Form.value.storageConfForm.storageUrlInput,
                rclone_vendor:
                    this.step2Form.value.storageConfForm.rcloneVendorSelect,
                rclone_user:
                    this.step2Form.value.storageConfForm.rcloneUserInput,
                rclone_password:
                    this.step2Form.value.storageConfForm.rclonePasswordInput,
                cvat_backup:
                    this.step2Form.value.storageConfForm.snapshotDatasetSelect,
            };
            request = this.deploymentsService.trainTool('ai4os-cvat', data);
        } else if (this.title == 'Deploy your LLM') {
            data.llm = {
                type: this.step1Form.value.generalConfForm.deploymentTypeSelect,
                vllm_model_id:
                    this.step1Form.value.generalConfForm.vllmModelSelect,
                ui_username:
                    this.step1Form.value.generalConfForm.uiUsernameInput,
                ui_password:
                    this.step1Form.value.generalConfForm.uiPasswordInput,
                HF_token:
                    this.step1Form.value.generalConfForm.huggingFaceTokenInput,
                openai_api_key:
                    this.step1Form.value.generalConfForm.openaiApiKeyInput,
                openai_api_url:
                    this.step1Form.value.generalConfForm.openaiApiUrlInput,
            };
            request = this.deploymentsService.trainTool('ai4os-llm', data);
        } else {
            data.hardware = {
                cpu_num: this.step2Form.value.hardwareConfForm.cpuNumberInput,
                ram: this.step2Form.value.hardwareConfForm.ramMemoryInput,
                disk: this.step2Form.value.hardwareConfForm.diskMemoryInput,
                gpu_num: this.step2Form.value.hardwareConfForm.gpuNumberInput,
                gpu_type: this.step2Form.value.hardwareConfForm.gpuModelSelect,
            };

            if (this.title == 'Federated learning with Flower') {
                data.flower = {
                    rounds: this.step3Form!.value.federatedConfForm.roundsInput,
                    metric: this.step3Form!.value.federatedConfForm.metricInput,
                    min_fit_clients:
                        this.step3Form!.value.federatedConfForm
                            .minFitClientsInput,
                    min_available_clients:
                        this.step3Form!.value.federatedConfForm
                            .minAvailableClientsInput,
                    strategy:
                        this.step3Form!.value.federatedConfForm
                            .strategyOptionsSelect,
                    mu:
                        this.step3Form!.value.federatedConfForm
                            .strategyOptionsSelect ===
                        'FedProx strategy (FedProx)'
                            ? this.step3Form!.value.federatedConfForm.muInput
                            : null,
                    fl:
                        this.step3Form!.value.federatedConfForm
                            .strategyOptionsSelect ===
                        'Federated Averaging with Momentum (FedAvgM)'
                            ? this.step3Form!.value.federatedConfForm.flInput
                            : null,
                    momentum:
                        this.step3Form!.value.federatedConfForm
                            .strategyOptionsSelect ===
                        'Federated Averaging with Momentum (FedAvgM)'
                            ? this.step3Form!.value.federatedConfForm
                                .momentumInput
                            : null,
                    dp: this.step3Form!.value.federatedConfForm.dpInput,
                    mp: this.step3Form!.value.federatedConfForm.dpInput
                        ? this.step3Form!.value.federatedConfForm.mpInput
                        : null,
                    noise_mult: this.step3Form!.value.federatedConfForm.dpInput
                        ? this.step3Form!.value.federatedConfForm.noiseMultInput
                        : null,
                    sampled_clients: this.step3Form!.value.federatedConfForm
                        .dpInput
                        ? this.step3Form!.value.federatedConfForm
                            .sampledClientsNumInput
                        : null,
                    clip_norm: this.step3Form!.value.federatedConfForm.dpInput
                        ? this.step3Form!.value.federatedConfForm
                            .clippingNormInput
                        : null,
                };
                request = this.deploymentsService.trainTool(
                    'ai4os-federated-server',
                    data
                );
            } else if (this.title == 'AI4life model loader') {
                request = this.deploymentsService.trainTool(
                    'ai4os-ai4life-loader',
                    data
                );
            } else if (this.title == 'Federated learning with NVFlare') {
                data.nvflare = {
                    username:
                        this.step3Form!.value.nvflareConfForm.usernameInput,
                    password:
                        this.step3Form!.value.nvflareConfForm.passwordInput,
                    app_location:
                        this.step3Form!.value.nvflareConfForm.appLocationInput,
                    public_project:
                        this.step3Form!.value.nvflareConfForm
                            .publicProjectSelect,
                    // convert dates: CET to UTC
                    starting_date:
                        this.step3Form!.value.nvflareConfForm
                            .startingDateInput === ''
                            ? ''
                            : new Date(
                                  this.step3Form!.value.nvflareConfForm.startingDateInput.getTime() -
                                      this.step3Form!.value.nvflareConfForm.startingDateInput.getTimezoneOffset() *
                                          60000
                            ).toISOString(),
                    end_date:
                        this.step3Form!.value.nvflareConfForm.endDateInput ===
                        ''
                            ? ''
                            : new Date(
                                  this.step3Form!.value.nvflareConfForm.endDateInput.getTime() -
                                      this.step3Form!.value.nvflareConfForm.endDateInput.getTimezoneOffset() *
                                          60000
                            ).toISOString(),
                };
                request = this.deploymentsService.trainTool(
                    'ai4os-nvflare',
                    data
                );
            } else {
                data.storage = {
                    rclone_conf:
                        this.step3Form!.value.storageConfForm.rcloneConfInput,
                    rclone_url:
                        this.step3Form!.value.storageConfForm.storageUrlInput,
                    rclone_vendor:
                        this.step3Form!.value.storageConfForm
                            .rcloneVendorSelect,
                    rclone_user:
                        this.step3Form!.value.storageConfForm.rcloneUserInput,
                    rclone_password:
                        this.step3Form!.value.storageConfForm
                            .rclonePasswordInput,
                    datasets:
                        this.step3Form!.value.storageConfForm.datasetsList[0]
                            ?.doi === ''
                            ? []
                            : this.step3Form!.value.storageConfForm
                                .datasetsList,
                };

                if (this.title === 'AI4OS Development Environment') {
                    request = this.deploymentsService.trainTool(
                        'ai4os-dev-env',
                        data
                    );
                } else {
                    request = this.deploymentsService.postTrainModule(data);
                }
            }
        }
        request.subscribe({
            next: (result: StatusReturn) => {
                this.isLoading = false;

                if (result && result.status == 'success') {
                    this.router
                        .navigate(['/tasks/deployments'])
                        .then((navigated: boolean) => {
                            if (navigated) {
                                this.snackbarService.openSuccess(
                                    'Deployment created with ID ' +
                                        result.job_ID
                                );
                            }
                        });
                } else {
                    if (result && result.status == 'fail') {
                        this.snackbarService.openError(
                            'Error while creating the deployment ' +
                                result.error_msg
                        );
                    }
                }
            },
            error: () => {
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    createOscarService() {
        this.isLoading = true;
        const data: TrainModuleRequest = {
            general: {
                title:
                    this.step1Form.value.generalConfForm.titleInput === ''
                        ? uniqueNamesGenerator({
                            dictionaries: [colors, animals],
                        })
                        : this.step1Form.value.generalConfForm.titleInput,
                desc: this.step1Form.value.generalConfForm.descriptionInput,
                docker_image:
                    this.step1Form.getRawValue().generalConfForm
                        .dockerImageInput,
                docker_tag:
                    this.step1Form.value.generalConfForm.dockerTagSelect,
            },
            hardware: {
                cpu_num: this.step2Form.value.hardwareConfForm.cpuNumberInput,
                ram: this.step2Form.value.hardwareConfForm.ramMemoryInput,
            },
        };

        this.oscarInferenceService.createService(data).subscribe({
            next: (serviceName: string) => {
                this.isLoading = false;
                if (serviceName != '') {
                    this.router
                        .navigate(['/tasks/inference'])
                        .then((navigated: boolean) => {
                            if (navigated) {
                                this.snackbarService.openSuccess(
                                    'OSCAR service created with uuid ' +
                                        serviceName
                                );
                            } else {
                                this.snackbarService.openError(
                                    'Error while creating service with uuid ' +
                                        serviceName
                                );
                            }
                        });
                }
            },
            error: () => {
                this.isLoading = false;
            },
        });
    }

    createBatchDeployment() {
        const data: TrainModuleRequest = {
            general: {
                title:
                    this.step1Form.value.generalConfForm.titleInput === ''
                        ? uniqueNamesGenerator({
                            dictionaries: [colors, animals],
                        })
                        : this.step1Form.value.generalConfForm.titleInput,
                desc: this.step1Form.value.generalConfForm.descriptionInput,
                docker_image:
                    this.step1Form.getRawValue().generalConfForm
                        .dockerImageInput,
                docker_tag:
                    this.step1Form.value.generalConfForm.dockerTagSelect,
            },
            hardware: {
                cpu_num: this.step2Form.value.hardwareConfForm.cpuNumberInput,
                ram: this.step2Form.value.hardwareConfForm.ramMemoryInput,
                disk: this.step2Form.value.hardwareConfForm.diskMemoryInput,
                gpu_num: this.step2Form.value.hardwareConfForm.gpuNumberInput,
                gpu_type: this.step2Form.value.hardwareConfForm.gpuModelSelect,
            },
            storage: {
                rclone_conf:
                    this.step3Form!.value.storageConfForm.rcloneConfInput,
                rclone_url:
                    this.step3Form!.value.storageConfForm.storageUrlInput,
                rclone_vendor:
                    this.step3Form!.value.storageConfForm.rcloneVendorSelect,
                rclone_user:
                    this.step3Form!.value.storageConfForm.rcloneUserInput,
                rclone_password:
                    this.step3Form!.value.storageConfForm.rclonePasswordInput,
                datasets:
                    this.step3Form!.value.storageConfForm.datasetsList[0]
                        ?.doi === ''
                        ? []
                        : this.step3Form!.value.storageConfForm.datasetsList,
            },
        };
        const batchFile = this.step1Form.value.generalConfForm.batchFile;

        this.deploymentsService.postBatchDeployment(data, batchFile).subscribe({
            next: (result: StatusReturn) => {
                this.isLoading = false;

                if (result && result.status == 'success') {
                    this.router
                        .navigate(['/tasks/batch'])
                        .then((navigated: boolean) => {
                            if (navigated) {
                                this.snackbarService.openSuccess(
                                    'Batch deployment created with ID ' +
                                        result.job_ID
                                );
                            }
                        });
                } else {
                    if (result && result.status == 'fail') {
                        this.snackbarService.openError(
                            'Error while creating the batch deployment ' +
                                result.error_msg
                        );
                    }
                }
            },
            error: () => {
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }

    getStepperOrientation(): StepperOrientation {
        let orientation = 'horizontal' as StepperOrientation;
        if (this.mobileQuery.matches) {
            orientation = 'vertical';
        }
        return orientation;
    }
}
