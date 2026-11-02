import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    inject,
    ViewChild,
} from '@angular/core';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    NvflareConfiguration,
    NvflareToolConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import {
    ShowGeneralFormField,
    GeneralConfFormComponent,
} from '../../../conf-forms/general-conf-form/general-conf-form.component';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ShowHardwareField,
    HardwareConfFormComponent,
} from '../../../conf-forms/hardware-conf-form/hardware-conf-form.component';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';
import { NvflareConfFormComponent } from '../../../conf-forms/nvflare-conf-form/nvflare-conf-form.component';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';

@Component({
    selector: 'app-nvflare',
    templateUrl: './nvflare.component.html',
    styleUrl: './nvflare.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
        NvflareConfFormComponent,
    ],
})
export class NvflareComponent implements OnInit {
    _formBuilder = inject(FormBuilder);
    route = inject(ActivatedRoute);
    toolsService = inject(ToolsService);
    deploymentsService = inject(DeploymentsService);
    snackbarService = inject(SnackbarService);
    router = inject(Router);

    @ViewChild(GeneralConfFormComponent)
    generalConfFormCmp!: GeneralConfFormComponent;
    @ViewChild(HardwareConfFormComponent)
    hardwareConfFormCmp!: HardwareConfFormComponent;
    @ViewChild(NvflareConfFormComponent)
    nvflareConfFormCmp!: NvflareConfFormComponent;

    title = '';
    step1Title = 'CATALOG.CONF-FORMS.GENERAL.TITLE';
    step2Title = 'CATALOG.CONF-FORMS.HARDWARE.TITLE';
    step3Title = 'CATALOG.CONF-FORMS.NVFLARE.TITLE';

    showHelp = false;
    showLoader = false;
    warningMessage = '';

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    nvflareConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    nvflareConfDefaultValues!: NvflareConfiguration;

    showGeneralFields: ShowGeneralFormField = {
        titleInput: true,
        descriptionInput: true,
        serviceToRunChip: false,
        serviceToRunPassInput: false,
        dockerImageInput: false,
        dockerTagSelect: false,
        infoButton: true,
        co2EmissionsInput: false,
    };

    showHardwareFields: ShowHardwareField = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: false,
        gpu_type: false,
    };

    ngOnInit(): void {
        this.loadModule();
    }

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.toolsService.getTool(params['id']).subscribe((tool) => {
                this.title = tool.title;
            });
            this.showLoader = true;
            this.toolsService
                .getNvflareConfiguration(params['id'])
                .subscribe((toolConf: NvflareToolConfiguration) => {
                    this.generalConfDefaultValues = toolConf.general;
                    this.hardwareConfDefaultValues = toolConf.hardware;
                    this.nvflareConfDefaultValues = toolConf.nvflare;

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
            nvflare: this.nvflareConfFormCmp.getPayload(),
        };

        this.deploymentsService.trainTool('ai4os-nvflare', request).subscribe({
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
