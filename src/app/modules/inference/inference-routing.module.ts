import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InferencesListComponent } from './components/inferences-list/inferences-list.component';
import { DeploymentDetailComponent } from '../deployments/components/deployment-detail/deployment-detail.component';

const routes: Routes = [
    {
        path: '',
        component: InferencesListComponent,
        data: {
            breadcrumb: 'Inference',
        },
    },
    {
        path: ':uuid',
        component: DeploymentDetailComponent,
        data: { type: 'tool' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InferenceRoutingModule {}
