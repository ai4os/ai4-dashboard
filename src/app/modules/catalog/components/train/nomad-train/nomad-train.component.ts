import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
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
import { StepperFormComponent } from '../stepper-form/stepper-form.component';
import { GeneralConfFormComponent } from '../general-conf-form/general-conf-form.component';
import { HardwareConfFormComponent } from '../hardware-conf-form/hardware-conf-form.component';
import { StorageConfFormComponent } from '../storage-conf-form/storage-conf-form.component';

@Component({
    selector: 'app-nomad-train',
    templateUrl: './nomad-train.component.html',
    styleUrls: ['./nomad-train.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        StepperFormComponent,
        FormsModule,
        ReactiveFormsModule,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
        StorageConfFormComponent,
    ],
})
export class NomadTrainComponent implements OnInit {
    modulesService = inject(ModulesService);
    _formBuilder = inject(FormBuilder);
    toolsService = inject(ToolsService);
    translateService = inject(TranslateService);
    route = inject(ActivatedRoute);
    router = inject(Router);

    constructor() {
        const navigation = this.router.currentNavigation();
        this.service =
            navigation?.extras?.state?.['service'] ||
            history.state?.['service'];
    }

    title = '';
    step1Title = 'CATALOG.CONF-FORMS.GENERAL.TITLE';
    step2Title = 'CATALOG.CONF-FORMS.HARDWARE.TITLE';
    step3Title = 'CATALOG.CONF-FORMS.DATA.TITLE';

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
            .getModuleNomadConfiguration('ai4os-demo-app')
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
                        .getModuleNomadConfiguration(params['id'])
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

    showHelpButtonChange(checked: boolean) {
        this.showHelp = checked;
    }
}
