import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';
import { ModuleTrainComponent } from './components/module-train/module-train.component';
import { ModulesListComponent } from './components/modules-list/modules-list.component';

const routes: Routes = [
    {
      path: '',
      component: ModulesListComponent,
    },
    {
      path: ':id', component: ModuleDetailComponent,
      children: [
       
      ]
      
    },
    {
      path:':id/train',
      component: ModuleTrainComponent

    }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
