import {
    Component,
    Input,
    OnChanges,
    ChangeDetectionStrategy,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
    UiTabsComponent,
    Tab,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import {
    ResourceSet,
    UserTimeseries,
} from '@app/shared/models/stats.view-models';
import { TimeSeriesChartComponent } from '../../charts/time-series-chart/time-series-chart.component';
import { StatsCardComponent } from '../../stats/stats-card/stats-card.component';
import { UiChipGroupComponent } from '@app/shared/components/ui/ui-chip-group/ui-chip-group.component';
import { FormsModule } from '@angular/forms';

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
        label: 'DASHBOARD.STATS-VALUES.RUNNING-DATA',
        icon: 'radio_button_checked',
        key: 'running',
        color: '--color-text-secondary',
        unit: '',
        factor: 1,
        decimals: 0,
    },
    {
        id: 'queued',
        label: 'DASHBOARD.STATS-VALUES.QUEUED-DATA',
        icon: 'hourglass_empty',
        key: 'queued',
        color: '--color-text-tertiary',
        unit: '',
        factor: 1,
        decimals: 0,
    },
    {
        id: 'cpu',
        label: 'DASHBOARD.STATS-TITLES.CPU',
        icon: 'memory',
        key: 'cpuNum',
        color: '--color-accent',
        unit: '',
        factor: 1,
        decimals: 0,
    },
    {
        id: 'cpuFreq',
        label: 'DASHBOARD.STATS-TITLES.CPU-FREQ',
        icon: 'graphic_eq',
        key: 'cpuMhz',
        color: '--color-accent-dark',
        unit: 'GHz',
        factor: 1 / 1000,
        decimals: 1,
    },
    {
        id: 'ram',
        label: 'DASHBOARD.STATS-TITLES.RAM',
        icon: 'memory_alt',
        key: 'memoryMB',
        color: '--color-secondary-4',
        unit: 'GiB',
        factor: 1 / 1024,
        decimals: 1,
    },
    {
        id: 'disk',
        label: 'DASHBOARD.STATS-TITLES.DISK',
        icon: 'album',
        key: 'diskMB',
        color: '--color-primary-dark',
        unit: 'GiB',
        factor: 1 / 1024,
        decimals: 1,
    },
    {
        id: 'gpu',
        label: 'DASHBOARD.STATS-TITLES.GPU',
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
}

@Component({
    selector: 'app-usage-tab',
    templateUrl: './usage-tab.component.html',
    styleUrls: ['./usage-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        UiChipGroupComponent,
        TranslatePipe,
        TimeSeriesChartComponent,
        UiTabsComponent,
        StatsCardComponent,
    ],
})
export class UsageTabComponent implements OnChanges {
    @Input({ required: true }) usage!: ResourceSet;
    @Input({ required: true }) timeseries!: UserTimeseries;

    readonly metrics = METRICS;
    readonly tabs: Tab[] = METRICS.map((m) => ({
        id: m.id,
        label: m.label,
        icon: m.icon,
    }));

    activeId = METRICS[0].id;

    selectedRange: string = '7d';
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
                  }
                : { current: 0, average: 0, peak: 0 };
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
