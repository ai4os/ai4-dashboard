import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesListComponent } from './components/modules-list/modules-list.component';

const routes: Routes = [
    {
        path: '',
        component: ModulesListComponent
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
