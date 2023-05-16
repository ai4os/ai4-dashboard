import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './core/guards/authentication.guard';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { ForbiddenComponent } from './modules/forbidden/forbidden.component';

const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    //canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
    children: [
      {
        path:'',
        redirectTo: 'modules',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'modules',
        loadChildren: () =>
          import('@modules/marketplace/marketplace.module').then(m => m.MarketplaceModule)
      },
      {
        path: 'deployments',
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@modules/deployments/deployments.module').then(m => m.DeploymentsModule)
      },
      {
        path: 'forbidden',
        loadChildren: () =>
        import('@modules/forbidden/forbidden.module').then(m => m.ForbiddenModule)
      },
      {
        path: '**', component: NotFoundComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
