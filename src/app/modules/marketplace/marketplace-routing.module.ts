import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@app/core/guards/authentication.guard';
import { ModuleDetailComponent } from './components/module-detail/module-detail.component';
import { ModuleTrainComponent } from './components/module-train/module-train.component';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { ModuleDetailViewComponent } from './views/module-detail-view/module-detail-view.component';
import { ModuleTestComponent } from './components/module-test/module-test.component';

const routes: Routes = [
  {
    path: '',
    component: ModulesListComponent,
    data: { breadcrumb: 'Modules'}
  },
  {
    path: ':id', component: ModuleDetailViewComponent,
    children: [
      {
        path: '', component: ModuleDetailComponent,
        data: { breadcrumb: { alias: 'moduleName' } }
      },
      {
        path: 'train',
        canActivate: [AuthenticationGuard],
        component: ModuleTrainComponent,
        data: { breadcrumb: 'Train' }
      },
      {
        path: 'test',
        //canActivate: [AuthenticationGuard],
        component: ModuleTestComponent,
        data: { breadcrumb: 'Test' }
      }

    ]

  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
