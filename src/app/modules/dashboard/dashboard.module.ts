import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { TimeSeriesChartComponent } from './components/time-series-chart/time-series-chart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '@app/shared/shared.module';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { StatsContainerComponent } from './components/stats-container/stats-container.component';

@NgModule({
    declarations: [
        TimeSeriesChartComponent,
        DashboardComponent,
        StatCardComponent,
        StatsContainerComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgxEchartsModule.forChild(),
        SharedModule,
    ],
})
export class DashboardModule {}
