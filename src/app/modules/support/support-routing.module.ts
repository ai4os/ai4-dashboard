import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportListComponent } from './support-list/support-list.component';

const routes: Routes = [
    {
        path: '',
        component: SupportListComponent,
        data: {
            breadcrumb: 'Support',
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SupportRoutingModule {}
