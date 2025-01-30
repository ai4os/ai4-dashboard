import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/marketplace/services/tools-service/tools.service';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    Ai4LifeLoaderToolConfiguration,
} from '@app/shared/interfaces/module.interface';
import { showGeneralFormField } from '../../general-conf-form/general-conf-form.component';
import { showHardwareField } from '../../hardware-conf-form/hardware-conf-form.component';

@Component({
    selector: 'app-ai4life-loader',
    templateUrl: './ai4life-loader.component.html',
    styleUrl: './ai4life-loader.component.scss',
})
export class Ai4lifeLoaderComponent {
    constructor(
        private toolsService: ToolsService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        const navigation = this.router.lastSuccessfulNavigation;
        this.modelId = navigation?.extras?.state?.['modelId'];
    }

    title = '';
    step1Title = 'MODULES.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'MODULES.MODULE-TRAIN.HARDWARE-CONF';
    modelId: string = '';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;

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
        modelId: true,
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
            this.toolsService.getTool(params['id']).subscribe((cvat) => {
                this.title = cvat.title;
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
                });
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
