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
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    Ai4LifeLoaderToolConfiguration,
    Ai4lifeConfiguration,
    confObject,
} from '@app/shared/interfaces/module.interface';
import {
    ShowGeneralFormField,
    GeneralConfFormComponent,
} from '../../../conf-forms/general-conf-form/general-conf-form.component';
import {
    ShowHardwareField,
    HardwareConfFormComponent,
} from '../../../conf-forms/hardware-conf-form/hardware-conf-form.component';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';
import { MatDivider } from '@angular/material/divider';
import { Ai4lifeConfFormComponent } from '../../../conf-forms/ai4life-conf-form/ai4life-conf-form.component';

const mockedConfObject: confObject = {
    name: '',
    value: '',
    description: '',
};

@Component({
    selector: 'app-ai4life-loader',
    templateUrl: './ai4life-loader.component.html',
    styleUrls: ['./ai4life-loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
        MatDivider,
        Ai4lifeConfFormComponent,
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
    step1Title = 'CATALOG.CONF-FORMS.GENERAL.TITLE';
    step2Title = 'CATALOG.CONF-FORMS.HARDWARE.TITLE';
    modelId = '';
    warningMessage = '';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    ai4lifeConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    ai4lifeConfDefaultValues: Ai4lifeConfiguration = {
        model_id: mockedConfObject,
    };
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

    showHardwareFields: ShowHardwareField = {
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
        this.showLoader = true;
        this.route.parent?.params.subscribe((params) => {
            this.toolsService.getTool(params['id']).subscribe((tool) => {
                this.title = tool.title;
            });
            this.toolsService
                .getAi4LifeConfiguration(params['id'])
                .subscribe((toolConf: Ai4LifeLoaderToolConfiguration) => {
                    this.generalConfDefaultValues = toolConf.general;
                    this.ai4lifeConfDefaultValues = {
                        ...this.ai4lifeConfDefaultValues,
                        model_id: toolConf.general.model_id!,
                    };
                    if (this.modelId) {
                        this.ai4lifeConfDefaultValues.model_id.value =
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

                    this.showLoader = false;
                });
        });
    }

    showHelpButtonChange(checked: boolean) {
        this.showHelp = checked;
    }
}
