import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@app/core/guards/authentication.guard';
import { Ai4eoscModuleDetailComponent } from '../components/modules-detail/ai4eosc-module-detail/ai4eosc-module-detail.component';
import { ModuleTrainComponent } from '../components/module-train/module-train/module-train.component';
import { ModulesListComponent } from '../components/lists/modules-list/modules-list.component';
import { ModuleDetailViewComponent } from '../views/module-detail-view/module-detail-view.component';
import { LoadingScreenComponent } from '../components/loading-screen/loading-screen.component';
import { Ai4lifeModuleDetailComponent } from '../components/modules-detail/ai4life-module-detail/ai4life-module-detail.component';
import { ToolTrainComponent } from '../views/tool-train-view/tool-train.component';
import { LlmsListComponent } from '../components/lists/llms-list/llms-list.component';

const routes: Routes = [
    {
        path: '',
        component: LlmsListComponent,
        data: { breadcrumb: 'Tools' },
    },
    // {
    //     path: ':id',
    //     component: ModuleDetailViewComponent,
    //     children: [
    //         {
    //             path: '',
    //             component: Ai4eoscModuleDetailComponent,
    //             data: { breadcrumb: { alias: 'moduleName' } },
    //         },
    //         {
    //             path: 'deploy',
    //             canActivate: [AuthenticationGuard],
    //             component: ToolTrainComponent,
    //             data: { breadcrumb: 'Deploy' },
    //         },
    //     ],
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LlmsRoutingModule {}
