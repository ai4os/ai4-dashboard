import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from '@shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { Ai4eoscModuleDetailComponent } from './components/modules-detail/ai4eosc-module-detail/ai4eosc-module-detail.component';
import { DatasetCreationDetailComponent } from './components/train/datasets/dataset-creation-detail-component/dataset-creation-detail.component';
import { DatasetsListComponent } from './components/train/datasets/datasets-list/datasets-list.component';
import { GeneralConfFormComponent } from './components/train/general-conf-form/general-conf-form.component';
import { HardwareConfFormComponent } from './components/train/hardware-conf-form/hardware-conf-form.component';
import { NomadTrainComponent } from './components/train/nomad-train/nomad-train.component';
import { StepperFormComponent } from './components/train/stepper-form/stepper-form.component';
import { StorageConfFormComponent } from './components/train/storage-conf-form/storage-conf-form.component';
import { CvatComponent } from './components/train/tool-train/cvat/cvat.component';
import { FederatedConfFormComponent } from './components/train/tool-train/federated-server/federated-conf-form/federated-conf-form.component';
import { FederatedServerComponent } from './components/train/tool-train/federated-server/federated-server.component';
import { Ai4eoscModuleCardComponent } from './components/modules-cards/ai4eosc-module-card/ai4eosc-module-card.component';
import { ModulesListComponent } from './components/lists/modules-list/modules-list.component';
import { CatalogRoutingModule } from './routes/catalog-routing.module';
import {
    SearchAi4eoscPipe,
    SearchAi4lifePipe,
    SearchLlmsPipe,
} from './pipes/search-card-pipe';
import { ModuleDetailViewComponent } from './views/module-detail-view/module-detail-view.component';
import { ToolTrainComponent } from './views/tool-train-view/tool-train.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { FilterComponentComponent } from './components/filters/filter-component/filter-component.component';
import { FiltersConfigurationDialogComponent } from './components/filters/filters-configuration-dialog/filters-configuration-dialog.component';
import { LlmComponent } from './components/train/tool-train/llm/llm.component';
import { Ai4lifeLoaderComponent } from './components/train/tool-train/ai4life-loader/ai4life-loader.component';
import { Ai4lifeListComponent } from './components/lists/modules-list/ai4life-list/ai4life-list.component';
import { Ai4lifeModuleCardComponent } from './components/modules-cards/ai4life-module-card/ai4life-module-card.component';
import { Ai4lifeModuleDetailComponent } from './components/modules-detail/ai4life-module-detail/ai4life-module-detail.component';
import { ToolsListComponent } from './components/lists/tools-list/tools-list.component';
import { LlmsListComponent } from './components/lists/llms-list/llms-list.component';
import { LlmCardComponent } from './components/modules-cards/llm-card/llm-card.component';
import { CatalogListComponent } from './components/lists/catalog-list/catalog-list.component';
import { NvflareComponent } from './components/train/tool-train/nvflare/nvflare.component';
import { NvflareConfFormComponent } from './components/train/tool-train/nvflare/nvflare-conf-form/nvflare-conf-form.component';

@NgModule({
    declarations: [
        ModulesListComponent,
        Ai4lifeListComponent,
        Ai4eoscModuleCardComponent,
        Ai4lifeModuleCardComponent,
        SearchAi4eoscPipe,
        SearchAi4lifePipe,
        SearchLlmsPipe,
        Ai4eoscModuleDetailComponent,
        Ai4lifeModuleDetailComponent,
        NomadTrainComponent,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
        StorageConfFormComponent,
        ModuleDetailViewComponent,
        ToolTrainComponent,
        FederatedServerComponent,
        StepperFormComponent,
        FederatedConfFormComponent,
        DatasetsListComponent,
        DatasetCreationDetailComponent,
        CvatComponent,
        LlmComponent,
        Ai4lifeLoaderComponent,
        LoadingScreenComponent,
        FilterComponentComponent,
        FiltersConfigurationDialogComponent,
        NvflareComponent,
        NvflareConfFormComponent,
        CatalogListComponent,
        ToolsListComponent,
        LlmsListComponent,
        LlmCardComponent,
    ],
    imports: [
        CommonModule,
        CatalogRoutingModule,
        SharedModule,
        MatProgressBarModule,
        MatExpansionModule,
        MarkdownModule.forChild(),
        FormsModule,
        ScrollingModule,
    ],
})
export class CatalogModule {}
