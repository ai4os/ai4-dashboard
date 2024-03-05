import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleCardComponent } from './components/modules-list/module-card/module-card.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { SearchPipe } from './pipes/search-card-pipe';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';
import { MarkdownModule } from 'ngx-markdown';
import { GeneralConfFormComponent } from './components/module-train/general-conf-form/general-conf-form.component';
import { StorageConfFormComponent } from './components/module-train/storage-conf-form/storage-conf-form.component';
import { HardwareConfFormComponent } from './components/module-train/hardware-conf-form/hardware-conf-form.component';
import { ModuleDetailViewComponent } from './views/module-detail-view/module-detail-view.component';
import { DevModuleCardComponent } from './components/modules-list/dev-module-card/dev-module-card.component';
import { ModuleTrainComponent } from './components/module-train/module-train/module-train.component';
import { FederatedServerComponent } from './components/module-train/tool-train/federated-server/federated-server.component';
import { StepperFormComponent } from './components/module-train/stepper-form/stepper-form.component';
import { FederatedConfFormComponent } from './components/module-train/tool-train/federated-server/federated-conf-form/federated-conf-form.component';
import { ToolTrainComponent } from './views/tool-train-view/tool-train.component';
import { KafkaServerComponent } from './components/module-train/tool-train/kafka-server/kafka-server.component';

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
        KafkaServerComponent,
    ],
    imports: [
        CommonModule,
        MarketplaceRoutingModule,
        SharedModule,
        MarkdownModule.forChild(),
    ],
})
export class MarketplaceModule {}
