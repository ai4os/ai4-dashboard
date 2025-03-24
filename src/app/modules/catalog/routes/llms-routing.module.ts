import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@app/core/guards/authentication.guard';
import { ModuleDetailViewComponent } from '../views/module-detail-view/module-detail-view.component';
import { ToolTrainComponent } from '../views/tool-train-view/tool-train.component';
import { LlmsListComponent } from '../components/lists/llms-list/llms-list.component';

const routes: Routes = [
    {
        path: '',
        component: LlmsListComponent,
        data: { breadcrumb: 'LLMs' },
    },
    {
        path: ':id',
        component: ModuleDetailViewComponent,
        data: { breadcrumb: { skip: true } },
        children: [
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
export class LlmsRoutingModule {}
