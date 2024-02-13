import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stats-container',
    templateUrl: './stats-container.component.html',
    styleUrls: ['./stats-container.component.scss'],
})
export class StatsContainerComponent {
    @Input() totalCpuNum: number = 0;
    @Input() usedCpuNum: number = 0;
    @Input() totalCpuMhz?: number = 0;
    @Input() usedCpuMhz?: number = 0;
    @Input() totalMemory: number = 0;
    @Input() usedMemory: number = 0;
    @Input() totalDisk: number = 0;
    @Input() usedDisk: number = 0;
    @Input() totalGpuNum: number = 0;
    @Input() usedGpuNum: number = 0;

    Math = Math;
    ramUnit = 'MiB';
    diskUnit = 'MiB';

    getMemoryUnit(): string {
        if (this.totalMemory > 1000) {
            // use GiB
            this.ramUnit = 'GiB';
            this.usedMemory = this.usedMemory / Math.pow(2, 10);
            this.totalMemory = this.totalMemory / Math.pow(2, 10);
        }
        return 'DASHBOARD.STATS-TITLES.RAM';
    }

    getDiskUnit(): string {
        if (this.totalDisk > 1000) {
            // use GiB
            this.diskUnit = 'GiB';
            this.usedDisk = this.usedDisk / Math.pow(2, 10);
            this.totalDisk = this.totalDisk / Math.pow(2, 10);
        }
        return 'DASHBOARD.STATS-TITLES.DISK';
    }
}
