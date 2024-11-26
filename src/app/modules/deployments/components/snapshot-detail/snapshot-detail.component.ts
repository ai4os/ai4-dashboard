import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Snapshot } from '@app/shared/interfaces/deployment.interface';
import { getSnapshotBadge } from '../../utils/deployment-badge';

@Component({
    selector: 'app-snapshot-detail',
    templateUrl: './snapshot-detail.component.html',
    styleUrl: './snapshot-detail.component.scss',
})
export class SnapshotDetailComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { snapshot: Snapshot },
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    snapshot!: Snapshot;
    statusBadge = '';
    protected snapshotHasError = false;
    isLoading = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    ngOnInit(): void {
        this.snapshot = this.data.snapshot;

        if (this.snapshot.error_msg && this.snapshot.error_msg != '') {
            this.snapshotHasError = true;
        }
        if (this.snapshot.description == '') {
            this.snapshot.description = '-';
        }

        this.statusBadge = getSnapshotBadge(this.snapshot.status);
    }
}
