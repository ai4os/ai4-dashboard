import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchListComponent } from './components/batch-list/batch-list.component';

const routes: Routes = [
    {
        path: '',
        component: BatchListComponent,
        data: {
            breadcrumb: 'Batch',
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BatchRoutingModule {}
