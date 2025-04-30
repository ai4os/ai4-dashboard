import { Component } from '@angular/core';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    NvflareConfiguration,
    NvflareToolConfiguration,
} from '@app/shared/interfaces/module.interface';
import { showGeneralFormField } from '../../general-conf-form/general-conf-form.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { showHardwareField } from '../../hardware-conf-form/hardware-conf-form.component';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';

@Component({
    selector: 'app-nvflare',
    templateUrl: './nvflare.component.html',
    styleUrl: './nvflare.component.scss',
})
export class NvflareComponent {
    constructor(
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private toolsService: ToolsService
    ) {}

    title = '';
    step1Title = 'CATALOG.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'CATALOG.MODULE-TRAIN.HARDWARE-CONF';
    step3Title = 'CATALOG.MODULE-TRAIN.NVFLARE-CONF';

    showHelp = false;
    showLoader = false;
    warningMessage = '';

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    nvflareConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    nvflareConfDefaultValues!: NvflareConfiguration;

    showGeneralFields: showGeneralFormField = {
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
        llmFields: false,
    };

    showHardwareFields: showHardwareField = {
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

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
