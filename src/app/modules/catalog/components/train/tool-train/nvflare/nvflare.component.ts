import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    inject,
} from '@angular/core';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    NvflareConfiguration,
    NvflareToolConfiguration,
} from '@app/shared/interfaces/module.interface';
import {
    ShowGeneralFormField,
    GeneralConfFormComponent,
} from '../../general-conf-form/general-conf-form.component';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    ShowHardwareField,
    HardwareConfFormComponent,
} from '../../hardware-conf-form/hardware-conf-form.component';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';
import { NvflareConfFormComponent } from './nvflare-conf-form/nvflare-conf-form.component';

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
        cvatFields: false,
        ai4lifeFields: false,
        batchFields: false,
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
                });
        });
    }

    showHelpButtonChange(checked: boolean) {
        this.showHelp = checked;
    }
}
