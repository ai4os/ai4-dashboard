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
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    ModuleConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import { TranslateService } from '@ngx-translate/core';
import {
    ShowGeneralFormField,
    GeneralConfFormComponent,
} from '../../conf-forms/general-conf-form/general-conf-form.component';
import {
    ShowHardwareField,
    HardwareConfFormComponent,
} from '../../conf-forms/hardware-conf-form/hardware-conf-form.component';
import { StepperFormComponent } from '../stepper-form/stepper-form.component';
import { OscarInferenceService } from '@app/modules/inference/services/oscar-inference.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

@Component({
    selector: 'app-oscar-train',
    templateUrl: './oscar-train.component.html',
    styleUrl: './oscar-train.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
    ],
})
export class OscarTrainComponent implements OnInit {
    _formBuilder = inject(FormBuilder);
    modulesService = inject(ModulesService);
    oscarInferenceService = inject(OscarInferenceService);
    snackbarService = inject(SnackbarService);
    translateService = inject(TranslateService);
    route = inject(ActivatedRoute);
    router = inject(Router);

    @ViewChild(GeneralConfFormComponent)
    generalConfFormCmp!: GeneralConfFormComponent;
    @ViewChild(HardwareConfFormComponent)
    hardwareConfFormCmp!: HardwareConfFormComponent;

    constructor() {
        const navigation = this.router.currentNavigation();
        this.service =
            navigation?.extras?.state?.['service'] ||
            history.state?.['service'];
    }

    title = '';
    step1Title = 'CATALOG.CONF-FORMS.GENERAL.TITLE';
    step2Title = 'CATALOG.CONF-FORMS.HARDWARE.TITLE';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;

    showGeneralFields: ShowGeneralFormField = {
        titleInput: true,
        descriptionInput: true,
        co2EmissionsInput: false,
        serviceToRunChip: false,
        serviceToRunPassInput: false,
        dockerImageInput: true,
        dockerTagSelect: true,
        infoButton: true,
        cvatFields: false,
        ai4lifeFields: false,
        batchFields: false,
    };

    showHardwareFields: ShowHardwareField = {
        cpu_num: true,
        ram: true,
        disk: false,
        gpu_num: false,
        gpu_type: false,
    };

    service: string | undefined;
    warningMessage = '';

    ngOnInit(): void {
        this.loadSpecificModule();
    }

    loadSpecificModule() {
        this.route.parent?.params.subscribe((params) => {
            this.modulesService.getModule(params['id']).subscribe((module) => {
                this.title = module.title;
                this.modulesService
                    .getModuleOscarConfiguration(params['id'])
                    .subscribe((moduleConf: ModuleConfiguration) => {
                        this.generalConfDefaultValues = moduleConf.general;
                        this.hardwareConfDefaultValues = moduleConf.hardware;

                        // Check if config has a warning
                        if (
                            this.hardwareConfDefaultValues.warning &&
                            this.hardwareConfDefaultValues.warning !== ''
                        ) {
                            this.warningMessage =
                                this.hardwareConfDefaultValues.warning;
                        }
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
        };

        this.oscarInferenceService.createService(request).subscribe({
            next: (serviceName: string) => {
                this.showLoader = false;
                if (serviceName !== '') {
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
                this.showLoader = false;
            },
        });
    }
}
