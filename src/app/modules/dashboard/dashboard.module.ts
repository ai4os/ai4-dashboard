import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { GraphTestComponent } from './components/graph-test/graph-test.component';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    declarations: [GraphTestComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgxEchartsModule.forChild(),
    ],
})
export class DashboardModule {}
