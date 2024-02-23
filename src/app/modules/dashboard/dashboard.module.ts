import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { TimeSeriesChartComponent } from './components/time-series-chart/time-series-chart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '@app/shared/shared.module';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { StatsContainerComponent } from './components/stats-container/stats-container.component';
import { OverviewTabComponent } from './components/tabs/overview-tab/overview-tab.component';
import { GraphsTabComponent } from './components/tabs/graphs-tab/graphs-tab.component';
import { NodesTabComponent } from './components/tabs/nodes-tab/nodes-tab.component';

@NgModule({
    declarations: [
        TimeSeriesChartComponent,
        DashboardComponent,
        StatCardComponent,
        StatsContainerComponent,
        OverviewTabComponent,
        GraphsTabComponent,
        NodesTabComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgxEchartsModule.forChild(),
        SharedModule,
    ],
})
export class DashboardModule {}
