import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    ModuleGeneralConfiguration,
    LlmConfiguration,
    LlmToolConfiguration,
} from '@app/shared/interfaces/module.interface';
import { showGeneralFormField } from '../../general-conf-form/general-conf-form.component';
import { showLlmField } from './llm-conf-form/llm-conf-form.component';

@Component({
    selector: 'app-llm',
    templateUrl: './llm.component.html',
    styleUrl: './llm.component.scss',
})
export class LlmComponent {
    constructor(
        private toolsService: ToolsService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {
        const navigation = this.router.lastSuccessfulNavigation;
        this.llmId = navigation?.extras?.state?.['llmId'];
    }

    title = '';
    step1Title = 'CATALOG.MODULE-TRAIN.GENERAL-CONF';
    step2Title = 'CATALOG.MODULE-TRAIN.LLM-CONF';

    showHelp = false;
    showLoader = false;

    llmId = '';

    generalConfForm: FormGroup = this._formBuilder.group({});
    llmConfForm: FormGroup = this._formBuilder.group({});
    generalConfDefaultValues!: ModuleGeneralConfiguration;
    llmConfDefaultValues!: LlmConfiguration;

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

    showLlmFields: showLlmField = {
        type: true,
        model_id: true,
        ui_password: true,
        HF_token: true,
        openai_api_key: true,
        openai_api_url: true,
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
                .getVllmConfiguration(params['id'])
                .subscribe((toolConf: LlmToolConfiguration) => {
                    this.generalConfDefaultValues = toolConf.general;
                    this.llmConfDefaultValues = toolConf.llm;
                    if (this.llmId !== '') {
                        this.llmConfDefaultValues.model_id.value = this.llmId;
                    }
                });
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
