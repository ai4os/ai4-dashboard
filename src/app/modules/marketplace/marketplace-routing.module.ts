import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@app/core/guards/authentication.guard';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';
import { ModuleTrainComponent } from './components/module-train//module-train/module-train.component';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleDetailViewComponent } from './views/module-detail-view/module-detail-view.component';
import { ToolTrainComponent } from './views/tool-train-view/tool-train.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';

const routes: Routes = [
    {
        path: '',
        component: ModulesListComponent,
        data: { breadcrumb: 'Marketplace' },
    },
    {
        path: 'modules/:id',
        component: ModuleDetailViewComponent,
        children: [
            {
                path: '',
                component: ModuleDetailComponent,
                data: { breadcrumb: { alias: 'moduleName' } },
            },
            {
                path: 'deploy',
                canActivate: [AuthenticationGuard],
                component: ModuleTrainComponent,
                data: { breadcrumb: 'Deploy' },
            },
            {
                path: 'try-me-nomad',
                canActivate: [AuthenticationGuard],
                component: LoadingScreenComponent,
            },
        ],
    },
    {
        path: 'tools/:id',
        component: ModuleDetailViewComponent,
        children: [
            {
                path: '',
                component: ModuleDetailComponent,
                data: { breadcrumb: { alias: 'moduleName' } },
            },
            {
                path: 'deploy',
                canActivate: [AuthenticationGuard],
                component: ToolTrainComponent,
                data: { breadcrumb: 'Deploy' },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MarketplaceRoutingModule {}
