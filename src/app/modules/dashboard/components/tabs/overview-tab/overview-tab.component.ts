import { Component, Input } from '@angular/core';
import { GlobalStats, GpuStats } from '@app/shared/interfaces/stats.interface';

@Component({
    selector: 'app-overview-tab',
    templateUrl: './overview-tab.component.html',
    styleUrls: ['./overview-tab.component.scss'],
})
export class OverviewTabComponent {
    @Input()
    clusterGlobalStats!: GlobalStats;
    @Input()
    userGlobalStats!: GlobalStats;
    @Input() gpuPerModelCluster!: GpuStats[];
}
