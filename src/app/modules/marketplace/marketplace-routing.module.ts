import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@app/core/guards/authentication.guard';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';
import { ModuleTrainComponent } from './components/module-train//module-train/module-train.component';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleDetailViewComponent } from './views/module-detail-view/module-detail-view.component';
import { ToolTrainComponent } from './views/tool-train-view/tool-train.component';
import { ModuleTryComponent } from './components/module-try/module-try.component';
import { ModuleOscarDeployComponent } from './components/module-oscar-deploy/module-oscar-deploy.component';

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
                path: 'train',
                canActivate: [AuthenticationGuard],
                component: ModuleTrainComponent,
                data: { breadcrumb: 'Train' },
            },
            {
                path: 'tryme',
                canActivate: [AuthenticationGuard],
                component: ModuleTryComponent,
                data: { breadcrumb: 'Try Me' },
            },
            {
                path: 'oscar-deploy',
                canActivate: [AuthenticationGuard],
                component: ModuleOscarDeployComponent,
                data: { breadcrumb: 'Create service' },
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
                path: 'train',
                canActivate: [AuthenticationGuard],
                component: ToolTrainComponent,
                data: { breadcrumb: 'Train' },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MarketplaceRoutingModule {}
