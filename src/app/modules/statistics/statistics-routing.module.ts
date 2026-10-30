import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformStatsComponent } from './components/platform/platform-stats/platform-stats.component';
import { UserStatsComponent } from './components/user/user-stats/user-stats.component';

const routes: Routes = [
    { path: '', redirectTo: 'platform', pathMatch: 'full' },
    { path: 'platform', component: PlatformStatsComponent },
    { path: 'user', component: UserStatsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StatisticsRoutingModule {}
