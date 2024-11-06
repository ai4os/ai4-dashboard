import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentsListComponent } from './components/deployments-list/deployments-list.component';
import { DeploymentsRoutingModule } from './deployments-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { DeploymentDetailComponent } from './components/deployment-detail/deployment-detail.component';
import { SecretManagementDetailComponent } from './components/secret-management-detail/secret-management-detail.component';
import { SnapshotDetailComponent } from './components/snapshot-detail/snapshot-detail.component';

@NgModule({
    declarations: [
        DeploymentsListComponent,
        DeploymentDetailComponent,
        SecretManagementDetailComponent,
        SnapshotDetailComponent,
    ],
    imports: [CommonModule, DeploymentsRoutingModule, SharedModule],
})
export class DeploymentsModule {}
