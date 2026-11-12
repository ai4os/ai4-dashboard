import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InferencesListComponent } from './components/inferences-list/inferences-list.component';
import { InferenceDetailComponent } from './components/inference-detail/inference-detail.component';

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
        component: InferenceDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InferenceRoutingModule {}
