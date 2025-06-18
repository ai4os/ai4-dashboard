import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@app/core/guards/authentication.guard';
import { Ai4eoscModuleDetailComponent } from '../components/modules-detail/ai4eosc-module-detail/ai4eosc-module-detail.component';
import { ModuleDetailViewComponent } from '../views/module-detail-view/module-detail-view.component';
import { ToolTrainComponent } from '../views/tool-train-view/tool-train.component';
import { ToolsListComponent } from '../components/lists/tools-list/tools-list.component';

const routes: Routes = [
    {
        path: '',
        component: ToolsListComponent,
        data: { breadcrumb: 'Tools' },
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
export class ToolsRoutingModule {}
