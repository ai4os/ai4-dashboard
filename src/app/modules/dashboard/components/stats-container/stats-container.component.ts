import { Component, Input, OnInit } from '@angular/core';
import { GpuStats } from '@app/shared/interfaces/stats.interface';

@Component({
    selector: 'app-stats-container',
    templateUrl: './stats-container.component.html',
    styleUrls: ['./stats-container.component.scss'],
})
export class StatsContainerComponent implements OnInit {
    @Input() totalCpuNum = 0;
    @Input() usedCpuNum = 0;
    @Input() totalCpuMhz? = 0;
    @Input() usedCpuMhz? = 0;
    @Input() totalMemory = 0;
    @Input() usedMemory = 0;
    @Input() totalDisk = 0;
    @Input() usedDisk = 0;
    @Input() totalGpuNum = 0;
    @Input() usedGpuNum = 0;
    @Input() gpuPerModelCluster?: GpuStats[];
    @Input() usedLabel? = 'Used';
    @Input() freeLabel? = 'Free';

    Math = Math;
    ramUnit = 'MiB';
    diskUnit = 'MiB';

    ngOnInit(): void {
        this.setMemoryConfig();
        this.setDiskConfig();
    }

    setMemoryConfig() {
        if (this.totalMemory > 1000) {
            // use GiB
            this.ramUnit = 'GiB';
            this.usedMemory = this.usedMemory / Math.pow(2, 10);
            this.totalMemory = this.totalMemory / Math.pow(2, 10);
        }
    }

    setDiskConfig() {
        if (this.totalDisk > 1000) {
            // use GiB
            this.diskUnit = 'GiB';
            this.usedDisk = this.usedDisk / Math.pow(2, 10);
            this.totalDisk = this.totalDisk / Math.pow(2, 10);
        }
    }
}
