import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleCardComponent } from './components/modules-list/module-card/module-card.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    ModulesListComponent,
    ModuleCardComponent
  ],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class MarketplaceModule { }
