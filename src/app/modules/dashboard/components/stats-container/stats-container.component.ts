import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GpuStats } from '@app/shared/interfaces/stats.interface';
import { GpuStatsDetailComponent } from '../gpu-stats-detail/gpu-stats-detail.component';

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
    @Input() gpuPerModelCluster?: GpuStats[];

    constructor(
        public dialog: MatDialog,
        public confirmationDialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    Math = Math;
    ramUnit = 'MiB';
    diskUnit = 'MiB';

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

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

    openDetailGpuStats(): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(GpuStatsDetailComponent, {
            data: { gpuStats: this.gpuPerModelCluster },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }
}
