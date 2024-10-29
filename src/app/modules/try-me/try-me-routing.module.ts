import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TryMeListComponent } from './components/try-me-list/try-me-list.component';

const routes: Routes = [
    {
        path: '',
        component: TryMeListComponent,
        data: {
            breadcrumb: 'Try me',
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TryMeRoutingModule {}
