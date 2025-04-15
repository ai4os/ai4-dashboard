import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ModuleConfiguration,
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
    ModuleStorageConfiguration,
} from '@app/shared/interfaces/module.interface';
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';

@Component({
    selector: 'app-nomad-train',
    templateUrl: './nomad-train.component.html',
    styleUrls: ['./nomad-train.component.scss'],
})
export class NomadTrainComponent implements OnInit {
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
    step3Title = 'CATALOG.MODULE-TRAIN.DATA-CONF';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    storageConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    storageConfDefaultValues!: ModuleStorageConfiguration;

    service: string | undefined;
    warningMessage = '';

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
                            'CATALOG.MODULE-TRAIN.GENERAL-CONF-FORM.SNAPSHOT-ID'
                        ) + deployment.snapshot_ID;
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

                // Check if config has a warning
                if (
                    this.hardwareConfDefaultValues.warning &&
                    this.hardwareConfDefaultValues.warning !== ''
                ) {
                    this.warningMessage =
                        this.hardwareConfDefaultValues.warning;
                }
            });
    }

    loadSpecificModule() {
        this.route.parent?.params.subscribe((params) => {
            this.modulesService.getModule(params['id']).subscribe((module) => {
                this.title = module.title;

                if (this.title === 'AI4OS Development Environment') {
                    this.toolsService
                        .getDevEnvConfiguration(params['id'])
                        .subscribe((moduleConf: ModuleConfiguration) => {
                            this.generalConfDefaultValues = moduleConf.general;
                            this.hardwareConfDefaultValues =
                                moduleConf.hardware;
                            this.storageConfDefaultValues = moduleConf.storage;
                            if (this.service) {
                                this.generalConfDefaultValues.service.value =
                                    this.service;
                            }
                            // Check if config has a warning
                            if (
                                this.hardwareConfDefaultValues.warning &&
                                this.hardwareConfDefaultValues.warning !== ''
                            ) {
                                this.warningMessage =
                                    this.hardwareConfDefaultValues.warning;
                            }
                        });
                } else {
                    this.modulesService
                        .getModuleConfiguration(params['id'])
                        .subscribe((moduleConf: ModuleConfiguration) => {
                            this.generalConfDefaultValues = moduleConf.general;
                            this.hardwareConfDefaultValues =
                                moduleConf.hardware;
                            this.storageConfDefaultValues = moduleConf.storage;

                            if (this.service) {
                                this.generalConfDefaultValues.service.value =
                                    this.service;
                            }
                            // Check if config has a warning
                            if (
                                this.hardwareConfDefaultValues.warning &&
                                this.hardwareConfDefaultValues.warning !== ''
                            ) {
                                this.warningMessage =
                                    this.hardwareConfDefaultValues.warning;
                            }
                        });
                }
            });
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
