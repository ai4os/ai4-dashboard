import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { DashboardStatsService } from '@app/modules/statistics/services/dashboard-stats/dashboard-stats.service';

import { OverviewTabComponent } from '../tabs/overview-tab/overview-tab.component';
import { DatacentersTabComponent } from '../tabs/datacenters-tab/datacenters-tab.component';
import { FootprintTabComponent } from '../tabs/footprint-tab/footprint-tab.component';
import { UsageTabComponent } from '../tabs/usage-tab/usage-tab.component';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import {
    UiTabsComponent,
    Tab,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import {
    LoadState,
    ClusterViewModel,
    UserViewModel,
} from '@app/shared/models/stats.view-models';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { ZoneGridTabComponent } from '../tabs/zone-grid-tab/zone-grid-tab.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        UiBannerComponent,
        UiTabsComponent,
        OverviewTabComponent,
        DatacentersTabComponent,
        FootprintTabComponent,
        UsageTabComponent,
        TranslatePipe,
        UiLoaderComponent,
        ZoneGridTabComponent,
    ],
})
export class DashboardComponent implements OnInit {
    private readonly dashboardStats = inject(DashboardStatsService);
    readonly authService = inject(AuthService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly destroyRef = inject(DestroyRef);

    userProfile?: UserProfile;
    tabs: Tab[] = [];
    activeTabId = 'overview';

    cluster: LoadState<ClusterViewModel> = { loading: true, data: null };
    user: LoadState<UserViewModel> = { loading: false, data: null };

    constructor() {
        this.authService.userProfile$
            .pipe(takeUntilDestroyed())
            .subscribe((profile) => {
                if (profile) {
                    this.userProfile = profile;
                    this.updateTabs();
                    this.cdr.markForCheck();
                }
            });
    }

    ngOnInit(): void {
        this.updateTabs();

        this.dashboardStats
            .loadCluster()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((state) => (this.cluster = state));

        if (this.isLoggedIn()) {
            this.user = { loading: true, data: null };
            this.dashboardStats
                .loadUser()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((state) => {
                    this.user = state;
                    this.updateTabs();
                });
        }
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    showUserTabs(): boolean {
        return (
            this.isLoggedIn() &&
            !this.user.loading &&
            this.user.data !== null &&
            this.userProfile !== undefined
        );
    }

    updateTabs(): void {
        const userTabs: Tab[] = this.showUserTabs()
            ? [
                  {
                      id: 'usage',
                      label: 'DASHBOARD.USAGE-TAB',
                      icon: 'bar_chart',
                  },
                  {
                      id: 'footprint',
                      label: 'DASHBOARD.FOOTPRINT.TAB',
                      icon: 'eco',
                  },
              ]
            : [];

        this.tabs = [
            {
                id: 'overview',
                label: 'DASHBOARD.OVERVIEW-TAB',
                icon: 'dashboard',
            },
            ...userTabs,
            {
                id: 'datacenters',
                label: 'DASHBOARD.DATACENTERS-TAB',
                icon: 'location_on',
            },
            {
                id: 'grid',
                label: 'DASHBOARD.POWER-GRID.TAB',
                icon: 'charger',
            },
            { id: 'energy', label: 'DASHBOARD.ENERGY-TAB', icon: 'bolt' },
        ];

        if (!this.tabs.some((t) => t.id === this.activeTabId)) {
            this.activeTabId = 'overview';
        }
    }

    onTabChange(id: string): void {
        this.activeTabId = id;
    }
}
