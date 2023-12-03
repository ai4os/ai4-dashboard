import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { TimeSeriesChartComponent } from './components/time-series-chart/time-series-chart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [TimeSeriesChartComponent, DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgxEchartsModule.forChild(),
        SharedModule,
    ],
})
export class DashboardModule {}
