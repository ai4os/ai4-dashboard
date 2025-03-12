import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    FederatedServerConfiguration,
    FederatedServerToolConfiguration,
    ModuleGeneralConfiguration,
    ModuleHardwareConfiguration,
} from '@app/shared/interfaces/module.interface';
import { showHardwareField } from '../../hardware-conf-form/hardware-conf-form.component';
import { showGeneralFormField } from '../../general-conf-form/general-conf-form.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-federated-server',
    templateUrl: './federated-server.component.html',
    styleUrls: ['./federated-server.component.scss'],
})
export class FederatedServerComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private toolsService: ToolsService
    ) {}

    title = '';
    step1Title = 'CATALOG.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'CATALOG.MODULE-TRAIN.HARDWARE-CONF';
    step3Title = 'CATALOG.MODULE-TRAIN.FEDERATED-CONF';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    hardwareConfForm: FormGroup = this._formBuilder.group({});
    federatedConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    hardwareConfDefaultValues!: ModuleHardwareConfiguration;
    federatedConfDefaultValues!: FederatedServerConfiguration;

    showHardwareFields: showHardwareField = {
        cpu_num: true,
        ram: true,
        disk: true,
        gpu_num: false,
        gpu_type: false,
    };

    showGeneralFields: showGeneralFormField = {
        descriptionInput: true,
        serviceToRunChip: true,
        titleInput: true,
        co2EmissionsInput: true,
        serviceToRunPassInput: true,
        dockerImageInput: true,
        dockerTagSelect: true,
        infoButton: true,
        cvatUsername: false,
        cvatPassword: false,
        modelId: false,
    };

    ngOnInit(): void {
        this.loadModule();
    }

    loadModule() {
        this.route.parent?.params.subscribe((params) => {
            this.toolsService
                .getTool(params['id'])
                .subscribe((federatedServer) => {
                    this.title = federatedServer.title;
                });
            this.toolsService
                .getFederatedServerConfiguration(params['id'])
                .subscribe((moduleConf: FederatedServerToolConfiguration) => {
                    this.generalConfDefaultValues = moduleConf.general;
                    this.hardwareConfDefaultValues = moduleConf.hardware;
                    this.federatedConfDefaultValues = moduleConf.configuration;
                });
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
