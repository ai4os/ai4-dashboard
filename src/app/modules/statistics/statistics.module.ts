import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { TimeSeriesChartComponent } from './components/time-series-chart/time-series-chart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '@app/shared/shared.module';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { StatsContainerComponent } from './components/stats-container/stats-container.component';
import { OverviewTabComponent } from './components/tabs/overview-tab/overview-tab.component';
import { GraphsTabComponent } from './components/tabs/graphs-tab/graphs-tab.component';
import { NodesTabComponent } from './components/tabs/nodes-tab/nodes-tab.component';
import { GpuStatsDetailComponent } from './components/gpu-stats-detail/gpu-stats-detail.component';
import { DatacentersTabComponent } from './components/tabs/datacenters-tab/datacenters-tab.component';
import { SmallStatsCardComponent } from './components/small-stats-card/small-stats-card.component';

@NgModule({
    declarations: [
        TimeSeriesChartComponent,
        DashboardComponent,
        StatCardComponent,
        StatsContainerComponent,
        OverviewTabComponent,
        GraphsTabComponent,
        NodesTabComponent,
        GpuStatsDetailComponent,
        DatacentersTabComponent,
        SmallStatsCardComponent,
    ],
    imports: [
        CommonModule,
        StatisticsRoutingModule,
        NgxEchartsModule.forChild(),
        SharedModule,
    ],
})
export class StatisticsModule {}
