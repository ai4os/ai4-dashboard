import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/catalog/modules',
        pathMatch: 'full',
    },
    {
        path: 'modules',
        loadChildren: () =>
            import('@app/modules/catalog/routes/modules-routing.module').then(
                (m) => m.ModulesRoutingModule
            ),
    },
    {
        path: 'tools',
        loadChildren: () =>
            import('@app/modules/catalog/routes/tools-routing.module').then(
                (m) => m.ToolsRoutingModule
            ),
    },
    {
        path: 'llms',
        loadChildren: () =>
            import('@app/modules/catalog/routes/llms-routing.module').then(
                (m) => m.LlmsRoutingModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CatalogRoutingModule {}
