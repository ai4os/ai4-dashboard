import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';
import { ModulesListComponent } from './components/modules-list/modules-list.component';

const routes: Routes = [
    {
      path: '',
      component: ModulesListComponent,
    },
    {
      path: ':id', component: ModuleDetailComponent,
    },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
