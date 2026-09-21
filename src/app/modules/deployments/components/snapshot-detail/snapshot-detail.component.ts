import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Snapshot } from '@app/shared/interfaces/deployment.interface';
import { getSnapshotBadge } from '../../utils/deployment-badge';
import { SnapshotService } from '../../services/snapshots-service/snapshot.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import {
    ChipVariant,
    UiChipComponent,
} from '@app/shared/components/ui/ui-chip/ui-chip.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-snapshot-detail',
    standalone: true,
    templateUrl: './snapshot-detail.component.html',
    styleUrl: './snapshot-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatIcon,
        TranslatePipe,
        BreadcrumbComponent,
        UiLoaderComponent,
        UiBannerComponent,
        UiCardComponent,
        UiChipComponent,
        DatePipe,
    ],
})
export class SnapshotDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly snapshotService = inject(SnapshotService);
    private readonly snackbarService = inject(SnackbarService);
    translateService = inject(TranslateService);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    uuid = '';
    snapshot: Snapshot | undefined;
    statusBadge = '';
    snapshotHasError = false;
    isLoading = false;

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

    ngOnInit(): void {
        this.uuid = this.route.snapshot.paramMap.get('uuid') ?? '';

        if (!this.uuid) {
            return;
        }

        this.isLoading = true;
        this.snapshotService.getSnapshotByUUID(this.uuid).subscribe({
            next: (snapshot) => {
                if (!snapshot) {
                    this.snackbarService.openError(
                        "Couldn't find the requested snapshot."
                    );
                    this.isLoading = false;
                    return;
                }
                this.handleSnapshotLoaded(snapshot);
                this.isLoading = false;
            },
            error: () => {
                this.snackbarService.openError(
                    'Error retrieving the snapshot.'
                );
                this.isLoading = false;
            },
        });
    }

    private handleSnapshotLoaded(snapshot: Snapshot): void {
        snapshot.size = Math.trunc(snapshot.size) / Math.pow(1024, 3);
        snapshot.size = Number(snapshot.size.toFixed(2));

        if (snapshot.error_msg && snapshot.error_msg != '') {
            this.snapshotHasError = true;
        }
        if (snapshot.description == '') {
            snapshot.description = '-';
        }
        this.statusBadge = getSnapshotBadge(snapshot.status);
        this.snapshot = snapshot;
    }

    getStatusChipVariant(): ChipVariant {
        const shieldColor = this.statusBadge.split('-').pop() ?? '';
        const colorMap: Record<string, ChipVariant> = {
            green: 'success-solid',
            brightgreen: 'success-solid',
            red: 'danger-solid',
            orange: 'warning-solid',
            yellow: 'warning-solid',
            blue: 'primary-solid',
            grey: 'default-solid',
            gray: 'default-solid',
            lightgrey: 'default-solid',
            lightgray: 'default-solid',
        };
        return colorMap[shieldColor] ?? 'neutral';
    }
}
