import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformServicesListComponent } from './platform-services-list/platform-services-list.component';

const routes: Routes = [
    {
        path: '',
        component: PlatformServicesListComponent,
        data: {
            breadcrumb: 'Platform services',
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PlatformServicesRoutingModule {}
