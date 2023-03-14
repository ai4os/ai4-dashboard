import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleCardComponent } from './components/modules-list/module-card/module-card.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SearchPipe } from './pipes/search-card-pipe';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ModulesListComponent,
    ModuleCardComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class MarketplaceModule { }
