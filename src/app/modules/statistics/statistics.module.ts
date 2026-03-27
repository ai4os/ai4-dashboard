import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { TimeSeriesChartComponent } from './components/charts/time-series-chart/time-series-chart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '@app/shared/shared.module';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { StatsContainerComponent } from './components/stats-container/stats-container.component';
import { OverviewTabComponent } from './components/tabs/overview-tab/overview-tab.component';
import { UsageTabComponent } from './components/tabs/usage-tab/usage-tab.component';
import { NodesTabComponent } from './components/tabs/nodes-tab/nodes-tab.component';
import { GpuStatsDetailComponent } from './components/gpu-stats-detail/gpu-stats-detail.component';
import { DatacentersTabComponent } from './components/tabs/datacenters-tab/datacenters-tab.component';
import { FormsModule } from '@angular/forms';
import { FootprintTabComponent } from './components/tabs/footprint-tab/footprint-tab.component';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { FootprintChartComponent } from './components/charts/footprint-chart/footprint-chart.component';
import { StatsReducedCardComponent } from './components/stats/stats-reduced-card/stats-reduced-card.component';
import { ResourceBarComponent } from './components/stats/resource-bar/resource-bar.component';
import { ResourcesCardComponent } from './components/stats/resources-card/resources-card.component';
import { CountryFlagPipe } from './pipes/country-flag.pipe';
import { MapMetricSelectorComponent } from './components/stats/map-metric-selector/map-metric-selector.component';
import { MapMetricLegendComponent } from './components/stats/map-metric-legend/map-metric-legend.component';

@NgModule({
    declarations: [
        TimeSeriesChartComponent,
        BarChartComponent,
        DashboardComponent,
        StatCardComponent,
        StatsContainerComponent,
        OverviewTabComponent,
        UsageTabComponent,
        FootprintTabComponent,
        NodesTabComponent,
        GpuStatsDetailComponent,
        DatacentersTabComponent,
        FootprintChartComponent,
        StatsReducedCardComponent,
        ResourceBarComponent,
        ResourcesCardComponent,
        MapMetricSelectorComponent,
        MapMetricLegendComponent,
    ],
    imports: [
        CommonModule,
        StatisticsRoutingModule,
        NgxEchartsModule.forChild(),
        SharedModule,
        FormsModule,
        CountryFlagPipe,
    ],
})
export class StatisticsModule {}
