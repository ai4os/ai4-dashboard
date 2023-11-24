import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphTestComponent } from './components/graph-test/graph-test.component';

const routes: Routes = [
    {
        path: '',
        component: GraphTestComponent,
        data: {
            breadcrumb: 'Graph-test',
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {}
