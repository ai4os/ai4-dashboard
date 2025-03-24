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
import { ToolsService } from '@app/modules/marketplace/services/tools-service/tools.service';
import { showHardwareField } from '../../hardware-conf-form/hardware-conf-form.component';

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
    step1Title = 'MODULES.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'MODULES.MODULE-TRAIN.HARDWARE-CONF';
    step3Title = 'MODULES.MODULE-TRAIN.NVFLARE-CONF';

    showHelp = false;
    showLoader = false;

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
        cvatUsername: false,
        cvatPassword: false,
        modelId: false,
        co2EmissionsInput: false,
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
                });
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
