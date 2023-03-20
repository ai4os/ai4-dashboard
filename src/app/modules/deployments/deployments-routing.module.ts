import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeploymentsListComponent } from './components/deployments-list/deployments-list.component';

const routes: Routes = [
    {
      path: '',
      component: DeploymentsListComponent,
    },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeploymentsRoutingModule { }
