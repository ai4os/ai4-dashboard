import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleCardComponent } from './components/modules-list/module-card/module-card.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { SearchPipe } from './pipes/search-card-pipe';


@NgModule({
  declarations: [
    ModulesListComponent,
    ModuleCardComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    SharedModule
  ]
})
export class MarketplaceModule { }
