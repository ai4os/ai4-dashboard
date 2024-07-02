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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { statusReturn } from '@app/shared/interfaces/deployment.interface';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';
import { Observable } from 'rxjs';

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
        private router: Router,
        private _snackBar: MatSnackBar
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.cdr.detectChanges();
    }

    @Input() title!: string;
    @Input() step1!: TemplateRef<unknown>;
    @Input() step2!: TemplateRef<unknown>;
    @Input() step3!: TemplateRef<unknown>;
    @Input() step1Form!: FormGroup;
    @Input() step2Form!: FormGroup;
    @Input() step3Form!: FormGroup;
    @Input() step1Title!: string;
    @Input() step2Title!: string;
    @Input() step3Title!: string;
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

        let request: Observable<statusReturn>;
        const data: TrainModuleRequest = {
            general: {
                title: this.step1Form.value.generalConfForm.titleInput,
                desc: this.step1Form.value.generalConfForm.descriptionInput,
                docker_image:
                    this.step1Form.getRawValue().generalConfForm
                        .dockerImageInput,
                docker_tag:
                    this.step1Form.value.generalConfForm.dockerTagSelect,
                service: this.step1Form.value.generalConfForm.serviceToRunChip,
                jupyter_password:
                    this.step1Form.getRawValue().generalConfForm
                        .serviceToRunPassInput,
                hostname:
                    this.step1Form.getRawValue().generalConfForm.hostnameInput,
            },
            hardware: {
                cpu_num: this.step2Form.value.hardwareConfForm.cpuNumberInput,
                ram: this.step2Form.value.hardwareConfForm.ramMemoryInput,
                disk: this.step2Form.value.hardwareConfForm.diskMemoryInput,
                gpu_num: this.step2Form.value.hardwareConfForm.gpuNumberInput,
                gpu_type: this.step2Form.value.hardwareConfForm.gpuModelSelect,
            },
        };

        if (this.title == 'Federated learning server') {
            data.configuration = {
                rounds: this.step3Form.value.federatedConfForm.roundsInput,
                metric: this.step3Form.value.federatedConfForm.metricInput,
                min_fit_clients:
                    this.step3Form.value.federatedConfForm.minFitClientsInput,
                min_available_clients:
                    this.step3Form.value.federatedConfForm
                        .minAvailableClientsInput,
                strategy:
                    this.step3Form.value.federatedConfForm
                        .strategyOptionsSelect,
                mu:
                    this.step3Form.value.federatedConfForm
                        .strategyOptionsSelect === 'FedProx strategy (FedProx)'
                        ? this.step3Form.value.federatedConfForm.muInput
                        : null,
                fl:
                    this.step3Form.value.federatedConfForm
                        .strategyOptionsSelect ===
                    'Federated Averaging with Momentum (FedAvgM)'
                        ? this.step3Form.value.federatedConfForm.flInput
                        : null,
                momentum:
                    this.step3Form.value.federatedConfForm
                        .strategyOptionsSelect ===
                    'Federated Averaging with Momentum (FedAvgM)'
                        ? this.step3Form.value.federatedConfForm.momentumInput
                        : null,
            };
            request = this.deploymentsService.trainTool(data);
        } else {
            data.storage = {
                rclone_conf:
                    this.step3Form.value.storageConfForm.rcloneConfInput,
                rclone_url:
                    this.step3Form.value.storageConfForm.storageUrlInput,
                rclone_vendor:
                    this.step3Form.value.storageConfForm.rcloneVendorSelect,
                rclone_user:
                    this.step3Form.value.storageConfForm.rcloneUserInput,
                rclone_password:
                    this.step3Form.value.storageConfForm.rclonePasswordInput,
                datasets:
                    this.step3Form.value.storageConfForm.datasetsList[0].doi ===
                    ''
                        ? []
                        : this.step3Form.value.storageConfForm.datasetsList,
            };
            request = this.deploymentsService.postTrainModule(data);
        }

        request.subscribe({
            next: (result: statusReturn) => {
                this.isLoading = false;

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
