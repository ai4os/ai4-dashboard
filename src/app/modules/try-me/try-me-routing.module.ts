import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TryMeListComponent } from './components/try-me-list/try-me-list.component';
import { DeploymentDetailComponent } from '../deployments/components/deployment-detail/deployment-detail.component';

const routes: Routes = [
    {
        path: '',
        component: TryMeListComponent,
        data: {
            breadcrumb: 'Try me',
        },
    },
    {
        path: ':uuid',
        component: DeploymentDetailComponent,
        data: { type: 'try-me' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TryMeRoutingModule {}
