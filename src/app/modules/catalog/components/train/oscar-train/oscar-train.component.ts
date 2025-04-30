import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    ModuleConfiguration,
} from '@app/shared/interfaces/module.interface';
import { TranslateService } from '@ngx-translate/core';
import { showGeneralFormField } from '../general-conf-form/general-conf-form.component';
import { showHardwareField } from '../hardware-conf-form/hardware-conf-form.component';

@Component({
    selector: 'app-oscar-train',
    templateUrl: './oscar-train.component.html',
    styleUrl: './oscar-train.component.scss',
})
export class OscarTrainComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private modulesService: ModulesService,
        private toolsService: ToolsService,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.service =
            navigation?.extras?.state?.['service'] ||
            history.state?.['service'];
    }

    title = '';
    step1Title = 'CATALOG.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'CATALOG.MODULE-TRAIN.HARDWARE-CONF';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;

    showGeneralFields: showGeneralFormField = {
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
        llmFields: false,
    };

    showHardwareFields: showHardwareField = {
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

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
