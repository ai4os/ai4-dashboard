import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchListComponent } from './components/batch-list/batch-list.component';
import { DeploymentDetailComponent } from '../deployments/components/deployment-detail/deployment-detail.component';

const routes: Routes = [
    {
        path: '',
        component: BatchListComponent,
        data: {
            breadcrumb: 'Batch',
        },
    },
    {
        path: ':uuid',
        component: DeploymentDetailComponent,
        data: { type: 'batch' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BatchRoutingModule {}
