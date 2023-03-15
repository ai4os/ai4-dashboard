import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleCardComponent } from './components/modules-list/module-card/module-card.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { SearchPipe } from './pipes/search-card-pipe';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';


@NgModule({
  declarations: [
    ModulesListComponent,
    ModuleCardComponent,
    SearchPipe,
    ModuleDetailComponent
  ],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    SharedModule
  ]
})
export class MarketplaceModule { }
