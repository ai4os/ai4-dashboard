import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    computed,
    inject,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { StatsStore } from '@app/modules/statistics/store/stats.store';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import {
    UiTabsComponent,
    Tab,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { PlatformUsageTabComponent } from '../platform-usage-tab/platform-usage-tab.component';
import { PlatformFootprintTabComponent } from '../platform-footprint-tab/platform-footprint-tab.component';
import { DatacentersTabComponent } from '../datacenters-tab/datacenters-tab.component';
import { QueryTabsPage } from '../../../query-tabs.page';

@Component({
    selector: 'app-platform-stats',
    templateUrl: './platform-stats.component.html',
    styleUrls: ['./platform-stats.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        UiBannerComponent,
        UiTabsComponent,
        UiLoaderComponent,
        PlatformUsageTabComponent,
        PlatformFootprintTabComponent,
        DatacentersTabComponent,
        TranslatePipe,
    ],
})
export class PlatformStatsComponent extends QueryTabsPage implements OnInit {
    private readonly store = inject(StatsStore);
    private readonly destroyRef = inject(DestroyRef);

    readonly tabs: Tab[] = [
        {
            id: 'usage',
            label: 'STATS.PLATFORM.USAGE.TITLE',
            icon: 'bar_chart',
        },
        {
            id: 'footprint',
            label: 'STATS.PLATFORM.FOOTPRINT.TITLE',
            icon: 'eco',
        },
        {
            id: 'datacenters',
            label: 'STATS.PLATFORM.DATACENTERS.TITLE',
            icon: 'location_on',
        },
    ];

    readonly cluster = this.store.cluster;

    readonly timeseries = computed(
        () => this.store.user().data?.timeseries ?? null
    );

    ngOnInit(): void {
        this.syncTabWithUrl();

        this.destroyRef.onDestroy(this.store.connectCluster());
        this.destroyRef.onDestroy(this.store.connectUser());
    }
}
