import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GpuStats } from '@app/shared/interfaces/stats.interface';

@Component({
    selector: 'app-gpu-stats-detail',
    templateUrl: './gpu-stats-detail.component.html',
    styleUrls: ['./gpu-stats-detail.component.scss'],
})
export class GpuStatsDetailComponent {
    constructor(
        public confirmationDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: { gpuStats: GpuStats[] },
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    isLoading = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
}
