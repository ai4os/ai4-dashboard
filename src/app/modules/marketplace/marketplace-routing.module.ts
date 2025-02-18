import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@app/core/guards/authentication.guard';
import { Ai4eoscModuleDetailComponent } from './components/modules-detail/ai4eosc-module-detail/ai4eosc-module-detail.component';
import { ModuleTrainComponent } from './components/module-train//module-train/module-train.component';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleDetailViewComponent } from './views/module-detail-view/module-detail-view.component';
import { ToolTrainComponent } from './views/tool-train-view/tool-train.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { Ai4lifeModuleDetailComponent } from './components/modules-detail/ai4life-module-detail/ai4life-module-detail.component';

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
                component: Ai4eoscModuleDetailComponent,
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
        path: 'ai4life-modules/:name',
        component: ModuleDetailViewComponent,
        children: [
            {
                path: '',
                component: Ai4lifeModuleDetailComponent,
                data: { breadcrumb: { alias: 'moduleName' } },
            },
        ],
    },
    {
        path: 'tools/:id',
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
