import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject as inject_1,
    inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Snapshot } from '@app/shared/interfaces/deployment.interface';
import { getSnapshotBadge } from '../../utils/deployment-badge';

@Component({
    selector: 'app-snapshot-detail',
    templateUrl: './snapshot-detail.component.html',
    styleUrl: './snapshot-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class SnapshotDetailComponent implements OnInit {
    data = inject_1<{
        snapshot: Snapshot;
    }>(MAT_DIALOG_DATA);

    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
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
