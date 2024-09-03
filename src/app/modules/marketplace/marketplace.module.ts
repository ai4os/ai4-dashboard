import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from '@shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';
import { DatasetCreationDetailComponent } from './components/module-train/datasets/dataset-creation-detail-component/dataset-creation-detail.component';
import { DatasetsListComponent } from './components/module-train/datasets/datasets-list/datasets-list.component';
import { GeneralConfFormComponent } from './components/module-train/general-conf-form/general-conf-form.component';
import { HardwareConfFormComponent } from './components/module-train/hardware-conf-form/hardware-conf-form.component';
import { ModuleTrainComponent } from './components/module-train/module-train/module-train.component';
import { StepperFormComponent } from './components/module-train/stepper-form/stepper-form.component';
import { StorageConfFormComponent } from './components/module-train/storage-conf-form/storage-conf-form.component';
import { FederatedConfFormComponent } from './components/module-train/tool-train/federated-server/federated-conf-form/federated-conf-form.component';
import { FederatedServerComponent } from './components/module-train/tool-train/federated-server/federated-server.component';
import { DevModuleCardComponent } from './components/modules-list/dev-module-card/dev-module-card.component';
import { ModuleCardComponent } from './components/modules-list/module-card/module-card.component';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { SearchPipe } from './pipes/search-card-pipe';
import { ModuleDetailViewComponent } from './views/module-detail-view/module-detail-view.component';
import { ToolTrainComponent } from './views/tool-train-view/tool-train.component';

@NgModule({
    declarations: [
        ModulesListComponent,
        ModuleCardComponent,
        SearchPipe,
        ModuleDetailComponent,
        ModuleTrainComponent,
        GeneralConfFormComponent,
        HardwareConfFormComponent,
        StorageConfFormComponent,
        ModuleDetailViewComponent,
        DevModuleCardComponent,
        ToolTrainComponent,
        FederatedServerComponent,
        StepperFormComponent,
        FederatedConfFormComponent,
        DatasetsListComponent,
        DatasetCreationDetailComponent,
    ],
    imports: [
        CommonModule,
        MarketplaceRoutingModule,
        SharedModule,
        MatProgressBarModule,
        MatExpansionModule,
        MarkdownModule.forChild(),
        FormsModule,
        ScrollingModule,
    ],
})
export class MarketplaceModule {}
