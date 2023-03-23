import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleCardComponent } from './components/modules-list/module-card/module-card.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { SearchPipe } from './pipes/search-card-pipe';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';
import { MarkdownModule } from 'ngx-markdown';
import { ModuleTrainComponent } from './components/module-train/module-train.component';
import { GeneralConfFormComponent } from './components/module-train/general-conf-form/general-conf-form.component';
import { StorageConfFormComponent } from './components/module-train/storage-conf-form/storage-conf-form.component';
import { HardwareConfFormComponent } from './components/module-train/hardware-conf-form/hardware-conf-form.component';


@NgModule({
  declarations: [
    ModulesListComponent,
    ModuleCardComponent,
    SearchPipe,
    ModuleDetailComponent,
    ModuleTrainComponent,
    GeneralConfFormComponent,
    HardwareConfFormComponent,
    StorageConfFormComponent
  ],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ]
})
export class MarketplaceModule { }
