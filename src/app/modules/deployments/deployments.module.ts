import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentsListComponent } from './components/deployments-list/deployments-list.component';
import { DeploymentsRoutingModule } from './deployments-routing.module';
import { SharedModule } from '@app/shared/shared.module';



@NgModule({
  declarations: [
    DeploymentsListComponent
  ],
  imports: [
    CommonModule,
    DeploymentsRoutingModule,
    SharedModule
  ]
})
export class DeploymentsModule { }
