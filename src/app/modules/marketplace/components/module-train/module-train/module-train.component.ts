import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    ModuleConfiguration,
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    ModuleStorageConfiguration,
} from '@app/shared/interfaces/module.interface';
import { ModulesService } from '@app/modules/marketplace/services/modules-service/modules.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-module-train',
    templateUrl: './module-train.component.html',
    styleUrls: ['./module-train.component.scss'],
})
export class ModuleTrainComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private modulesService: ModulesService,
        private route: ActivatedRoute
    ) {}

    title = '';
    step1Title = 'MODULES.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'MODULES.MODULE-TRAIN.HARDWARE-CONF';
    step3Title = 'MODULES.MODULE-TRAIN.DATA-CONF';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    storageConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    storageConfDefaultValues!: ModuleStorageConfiguration;

    ngOnInit(): void {
        this.loadModule();
    }

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.modulesService.getModule(params['id']).subscribe((module) => {
                this.title = module.title;
            });
            this.modulesService
                .getModuleConfiguration(params['id'])
                .subscribe((moduleConf: ModuleConfiguration) => {
                    this.generalConfDefaultValues = moduleConf.general;
                    this.hardwareConfDefaultValues = moduleConf.hardware;
                    this.storageConfDefaultValues = moduleConf.storage;
                });
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
