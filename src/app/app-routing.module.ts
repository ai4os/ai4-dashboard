import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './core/guards/authentication.guard';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

const routes: Routes = [
    {
        path: '',
        component: ContentLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/catalog/modules',
                pathMatch: 'full',
            },
            {
                path: 'marketplace',
                redirectTo: 'catalog',
                pathMatch: 'prefix',
            },
            {
                path: 'statistics',
                loadChildren: () =>
                    import('@app/modules/statistics/statistics.module').then(
                        (m) => m.StatisticsModule
                    ),
            },
            {
                path: 'catalog',
                data: { breadcrumb: { skip: true } },
                loadChildren: () =>
                    import('@app/modules/catalog/catalog.module').then(
                        (m) => m.CatalogModule
                    ),
            },
            {
                path: 'tasks',
                redirectTo: '/tasks/deployments',
                pathMatch: 'full',
            },
            {
                path: 'tasks',
                children: [
                    {
                        path: 'deployments',
                        canActivate: [AuthenticationGuard],
                        loadChildren: () =>
                            import(
                                '@modules/deployments/deployments.module'
                            ).then((m) => m.DeploymentsModule),
                    },
                    {
                        path: 'inference',
                        canActivate: [AuthenticationGuard],
                        loadChildren: () =>
                            import(
                                '@app/modules/inference/inference.module'
                            ).then((m) => m.InferenceModule),
                    },
                    {
                        path: 'try-me',
                        canActivate: [AuthenticationGuard],
                        loadChildren: () =>
                            import('@app/modules/try-me/try-me.module').then(
                                (m) => m.TryMeModule
                            ),
                    },
                    {
                        path: 'batch',
                        canActivate: [AuthenticationGuard],
                        loadChildren: () =>
                            import('@app/modules/batch/batch.module').then(
                                (m) => m.BatchModule
                            ),
                    },
                ],
            },
            {
                path: 'forbidden',
                loadChildren: () =>
                    import('@modules/forbidden/forbidden.module').then(
                        (m) => m.ForbiddenModule
                    ),
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('@modules/profile/profile.module').then(
                        (m) => m.ProfileModule
                    ),
            },
            {
                path: '**',
                loadChildren: () =>
                    import('@modules/not-found/not-found.module').then(
                        (m) => m.NotFoundModule
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
