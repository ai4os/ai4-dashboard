import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    ModuleGeneralConfiguration,
    ModuleStorageConfiguration,
    CvatToolConfiguration,
} from '@app/shared/interfaces/module.interface';
import { ShowGeneralFormField } from '../../general-conf-form/general-conf-form.component';

@Component({
    selector: 'app-cvat',
    templateUrl: './cvat.component.html',
})
export class CvatComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private toolsService: ToolsService
    ) {}

    title = '';
    step1Title = 'CATALOG.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'CATALOG.MODULE-TRAIN.DATA-CONF';

    showHelp = false;
    showLoader = false;

    generalConfForm: FormGroup = this._formBuilder.group({});
    storageConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    storageConfDefaultValues!: ModuleStorageConfiguration;

    showGeneralFields: ShowGeneralFormField = {
        titleInput: true,
        descriptionInput: true,
        co2EmissionsInput: false,
        serviceToRunChip: false,
        serviceToRunPassInput: false,
        dockerImageInput: false,
        dockerTagSelect: false,
        infoButton: true,
        cvatFields: true,
        ai4lifeFields: false,
        llmFields: false,
        batchFields: false,
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
                .getCvatConfiguration(params['id'])
                .subscribe((toolConf: CvatToolConfiguration) => {
                    this.generalConfDefaultValues = toolConf.general;
                    this.storageConfDefaultValues = toolConf.storage;
                });
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
