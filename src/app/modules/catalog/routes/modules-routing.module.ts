import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@app/core/guards/authentication.guard';
import { Ai4eoscModuleDetailComponent } from '../components/modules-detail/ai4eosc-module-detail/ai4eosc-module-detail.component';
import { NomadTrainComponent } from '../components/train/nomad-train/nomad-train.component';
import { ModulesListComponent } from '../components/lists/modules-list/modules-list.component';
import { ModuleDetailViewComponent } from '../views/module-detail-view/module-detail-view.component';
import { LoadingScreenComponent } from '../components/loading-screen/loading-screen.component';
import { Ai4lifeModuleDetailComponent } from '../components/modules-detail/ai4life-module-detail/ai4life-module-detail.component';
import { ModuleTrainViewComponent } from '../views/module-train-view/module-train-view.component';
import { BatchTrainComponent } from '../components/train/batch-train/batch-train.component';

const routes: Routes = [
    {
        path: '',
        component: ModulesListComponent,
        data: { breadcrumb: 'Modules' },
    },
    {
        path: ':id',
        component: ModuleDetailViewComponent,
        children: [
            {
                path: '',
                component: Ai4eoscModuleDetailComponent,
                data: { breadcrumb: { alias: 'moduleName' } },
            },
            {
                path: 'deploy',
                canActivate: [AuthenticationGuard],
                component: ModuleTrainViewComponent,
                data: { breadcrumb: 'Deploy' },
            },
            {
                path: 'try-me-nomad',
                canActivate: [AuthenticationGuard],
                component: LoadingScreenComponent,
            },
            {
                path: 'batch',
                canActivate: [AuthenticationGuard],
                component: BatchTrainComponent,
                data: { breadcrumb: 'Batch' },
            },
        ],
    },
    {
        path: 'ai4life/:name',
        component: ModuleDetailViewComponent,
        children: [
            {
                path: '',
                component: Ai4lifeModuleDetailComponent,
                data: { breadcrumb: { skip: 'true' } },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ModulesRoutingModule {}
