import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    ModuleGeneralConfiguration,
    LlmToolConfiguration,
} from '@app/shared/interfaces/module.interface';
import { ShowGeneralFormField } from '../../general-conf-form/general-conf-form.component';

@Component({
    selector: 'app-llm',
    templateUrl: './llm.component.html',
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
    generalConfDefaultValues!: ModuleGeneralConfiguration;

    showGeneralFields: ShowGeneralFormField = {
        titleInput: true,
        descriptionInput: true,
        serviceToRunChip: false,
        serviceToRunPassInput: false,
        dockerImageInput: false,
        dockerTagSelect: false,
        infoButton: true,
        co2EmissionsInput: false,
        cvatFields: false,
        ai4lifeFields: false,
        llmFields: true,
        batchFields: false,
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
                    this.generalConfDefaultValues.llm = toolConf.llm;
                    if (this.llmId && this.llmId !== '') {
                        this.generalConfDefaultValues.llm.vllm_model_id.value =
                            this.llmId;
                    }
                });
        });
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelp = event.checked;
    }
}
