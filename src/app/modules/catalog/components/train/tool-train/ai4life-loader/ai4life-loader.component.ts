import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    Ai4LifeLoaderToolConfiguration,
} from '@app/shared/interfaces/module.interface';
import {
    ShowGeneralFormField,
    GeneralConfFormComponent,
} from '../../general-conf-form/general-conf-form.component';
import {
    showHardwareField,
    HardwareConfFormComponent,
} from '../../hardware-conf-form/hardware-conf-form.component';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';

@Component({
    selector: 'app-ai4life-loader',
    templateUrl: './ai4life-loader.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
    ],
})
export class Ai4lifeLoaderComponent implements OnInit {
    toolsService = inject(ToolsService);
    _formBuilder = inject(FormBuilder);
    route = inject(ActivatedRoute);
    router = inject(Router);

    constructor() {
        const navigation = this.router.lastSuccessfulNavigation();
        this.modelId = navigation?.extras?.state?.['modelId'];
    }

    title = '';
    step1Title = 'CATALOG.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'CATALOG.MODULE-TRAIN.HARDWARE-CONF';
    modelId = '';
    warningMessage = '';

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
        ai4lifeFields: true,
        batchFields: false,
    };

    showHardwareFields: showHardwareField = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: true,
        gpu_type: true,
    };

    ngOnInit(): void {
        this.loadModule();
    }

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.toolsService.getTool(params['id']).subscribe((tool) => {
                this.title = tool.title;
            });
            this.toolsService
                .getAi4LifeConfiguration(params['id'])
                .subscribe((toolConf: Ai4LifeLoaderToolConfiguration) => {
                    this.generalConfDefaultValues = toolConf.general;
                    if (this.modelId) {
                        this.generalConfDefaultValues.model_id!.value =
                            this.modelId;
                    }

                    this.hardwareConfDefaultValues = toolConf.hardware;
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
    }

    showHelpButtonChange(checked: boolean) {
        this.showHelp = checked;
    }
}
