import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './core/guards/authentication.guard';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';

const routes: Routes = [
    {
        path: '',
        component: ContentLayoutComponent,
        //canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
        children: [
            {
                path: '',
                redirectTo: 'marketplace',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('@modules/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'marketplace',
                loadChildren: () =>
                    import('@modules/marketplace/marketplace.module').then(
                        (m) => m.MarketplaceModule
                    ),
            },
            {
                path: 'deployments',
                canActivate: [AuthenticationGuard],
                loadChildren: () =>
                    import('@modules/deployments/deployments.module').then(
                        (m) => m.DeploymentsModule
                    ),
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
