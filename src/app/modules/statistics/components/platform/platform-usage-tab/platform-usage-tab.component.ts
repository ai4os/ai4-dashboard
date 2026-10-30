import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import {
    Tab,
    UiTabsComponent,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { UiChipGroupComponent } from '@app/shared/components/ui/ui-chip-group/ui-chip-group.component';
import {
    ClusterViewModel,
    UserTimeseries,
} from '@app/shared/models/stats.view-models';
import { GpuStatsDetailComponent } from '../gpu-stats-detail/gpu-stats-detail.component';
import { StatsCardComponent } from '../../common/stats-card/stats-card.component';
import { TimeSeriesChartComponent } from '../../charts/time-series-chart/time-series-chart.component';

interface MetricDef {
    id: string;
    label: string;
    icon: string;
    key: keyof Omit<UserTimeseries, 'dates'>;
    color: string;
    unit: string;
    factor: number;
    decimals: number;
}

const METRICS: MetricDef[] = [
    {
        id: 'running',
        label: 'STATS.METRICS.RESOURCES.RUNNING-DEPLOYMENTS',
        icon: 'radio_button_checked',
        key: 'running',
        color: '--color-text-secondary',
        unit: '',
        factor: 1,
        decimals: 0,
    },
    {
        id: 'queued',
        label: 'STATS.METRICS.RESOURCES.QUEUED-DEPLOYMENTS',
        icon: 'hourglass_empty',
        key: 'queued',
        color: '--color-text-tertiary',
        unit: '',
        factor: 1,
        decimals: 0,
    },
    {
        id: 'cpu',
        label: 'STATS.METRICS.RESOURCES.CPU',
        icon: 'memory',
        key: 'cpuNum',
        color: '--color-accent',
        unit: '',
        factor: 1,
        decimals: 0,
    },
    {
        id: 'cpuFreq',
        label: 'STATS.METRICS.RESOURCES.CPU-FREQ',
        icon: 'graphic_eq',
        key: 'cpuMhz',
        color: '--color-accent-dark',
        unit: 'GHz',
        factor: 1 / 1000,
        decimals: 1,
    },
    {
        id: 'ram',
        label: 'STATS.METRICS.RESOURCES.RAM',
        icon: 'memory_alt',
        key: 'memoryMB',
        color: '--color-secondary-4',
        unit: 'GiB',
        factor: 1 / 1024,
        decimals: 1,
    },
    {
        id: 'disk',
        label: 'STATS.METRICS.RESOURCES.DISK',
        icon: 'album',
        key: 'diskMB',
        color: '--color-primary-dark',
        unit: 'GiB',
        factor: 1 / 1024,
        decimals: 1,
    },
    {
        id: 'gpu',
        label: 'STATS.METRICS.RESOURCES.GPU',
        icon: 'developer_board',
        key: 'gpuNum',
        color: '--primary',
        unit: '',
        factor: 1,
        decimals: 0,
    },
];

interface Summary {
    current: number;
    average: number;
    peak: number;
    total: number;
}

@Component({
    selector: 'app-platform-usage-tab',
    templateUrl: './platform-usage-tab.component.html',
    styleUrls: ['./platform-usage-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        TranslatePipe,
        UiButtonComponent,
        UiChipGroupComponent,
        UiTabsComponent,
        StatsCardComponent,
        TimeSeriesChartComponent,
    ],
})
export class PlatformUsageTabComponent implements OnChanges {
    private readonly dialog = inject(MatDialog);

    @Input({ required: true }) cluster!: ClusterViewModel;
    @Input() timeseries: UserTimeseries | null = null;

    readonly metrics = METRICS;
    readonly tabs: Tab[] = METRICS.map((m) => ({
        id: m.id,
        label: m.label,
        icon: m.icon,
    }));

    activeId = METRICS[0].id;

    selectedRange: string = 'total';
    readonly timeRanges = [
        { id: '7d', label: '7d', limit: 7 },
        { id: '30d', label: '30d', limit: 30 },
        { id: 'total', label: 'Total', limit: Infinity },
    ];
    readonly rangeOptions = this.timeRanges.map((r) => ({
        value: r.id,
        viewValue: r.label,
    }));

    private fullSeries: Record<string, number[]> = {};
    private fullDates: string[] = [];

    filteredDates: string[] = [];
    filteredSeries: Record<string, number[]> = {};
    summaries: Record<string, Summary> = {};

    get active(): MetricDef {
        return METRICS.find((m) => m.id === this.activeId) ?? METRICS[0];
    }

    ngOnChanges(): void {
        this.fullDates = this.timeseries?.dates ?? [];

        for (const m of METRICS) {
            const raw = this.timeseries?.[m.key] ?? [];
            this.fullSeries[m.id] = raw.map(
                (v) => Math.round(v * m.factor * 100) / 100
            );
        }

        this.applyRangeFilter();
    }

    openGpuDetail(): void {
        this.dialog.open(GpuStatsDetailComponent, {
            data: { gpuStats: this.cluster.gpuModels },
            width: '650px',
            maxWidth: '95vw',
            autoFocus: false,
            restoreFocus: false,
            panelClass: 'ui-dialog-panel',
        });
    }

    onRangeChange(rangeId: string): void {
        this.selectedRange = rangeId;
        this.applyRangeFilter();
    }

    private applyRangeFilter(): void {
        const rangeObj =
            this.timeRanges.find((r) => r.id === this.selectedRange) ||
            this.timeRanges[0];
        const limit = rangeObj.limit;

        const startIndex =
            limit === Infinity ? 0 : Math.max(0, this.fullDates.length - limit);

        this.filteredDates = [...this.fullDates.slice(startIndex)];

        const newFilteredSeries: Record<string, number[]> = {};
        const newSummaries: Record<string, Summary> = {};

        for (const m of METRICS) {
            const seriesData = [
                ...(this.fullSeries[m.id] || []).slice(startIndex),
            ];
            newFilteredSeries[m.id] = seriesData;

            newSummaries[m.id] = seriesData.length
                ? {
                      current: seriesData[seriesData.length - 1],
                      average:
                          seriesData.reduce((a, b) => a + b, 0) /
                          seriesData.length,
                      peak: Math.max(...seriesData),
                      total: seriesData.reduce((a, b) => a + b, 0),
                  }
                : { current: 0, average: 0, peak: 0, total: 0 };
        }

        this.filteredSeries = newFilteredSeries;
        this.summaries = newSummaries;
    }

    round(v: number, decimals: number): number {
        const f = 10 ** decimals;
        return Math.round(v * f) / f;
    }

    onTabChange(id: string): void {
        this.activeId = id;
    }
}
