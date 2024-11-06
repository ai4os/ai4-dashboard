import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ModuleConfiguration,
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    ModuleStorageConfiguration,
} from '@app/shared/interfaces/module.interface';
import { ModulesService } from '@app/modules/marketplace/services/modules-service/modules.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-module-train',
    templateUrl: './module-train.component.html',
    styleUrls: ['./module-train.component.scss'],
})
export class ModuleTrainComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private modulesService: ModulesService,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.service = navigation?.extras?.state?.['service'];
    }

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

    service: string | undefined;

    ngOnInit(): void {
        const deploymentType = sessionStorage.getItem('deploymentType');
        if (deploymentType && deploymentType === 'snapshot') {
            this.title = 'Snapshots';
            sessionStorage.removeItem('deploymentType');
            this.loadGenericModule();
        } else {
            this.loadSpecificModule();
        }
    }

    loadGenericModule() {
        this.modulesService
            .getModuleConfiguration('ai4os-demo-app')
            .subscribe((moduleConf: ModuleConfiguration) => {
                this.generalConfDefaultValues = moduleConf.general;
                this.hardwareConfDefaultValues = moduleConf.hardware;
                this.storageConfDefaultValues = moduleConf.storage;

                if (this.service) {
                    this.generalConfDefaultValues.service.value = this.service;
                }

                const deploymentRow = sessionStorage.getItem('deploymentRow');
                if (deploymentRow) {
                    const deployment = JSON.parse(deploymentRow);
                    const snapshotText =
                        this.translateService.instant(
                            'MODULES.MODULE-TRAIN.GENERAL-CONF-FORM.SNAPSHOT-ID'
                        ) + deployment.snapshotID;
                    console.log(deployment);
                    this.generalConfDefaultValues.title.value = deployment.name;
                    this.generalConfDefaultValues.desc!.value = deployment.desc
                        ? deployment.desc + '\n' + snapshotText
                        : snapshotText;
                    this.generalConfDefaultValues.docker_image.value =
                        deployment.containerName;
                    this.generalConfDefaultValues.docker_tag.options = [
                        deployment.tagName,
                    ];
                    this.generalConfDefaultValues.docker_tag.value =
                        deployment.tagName;
                }
            });
    }

    loadSpecificModule() {
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

                    if (this.service) {
                        this.generalConfDefaultValues.service.value =
                            this.service;
                    }
                });
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
