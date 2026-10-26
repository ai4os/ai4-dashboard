import {
    Component,
    Input,
    OnChanges,
    ChangeDetectionStrategy,
    OnInit,
    inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {
    DatacenterStats,
    SeriesPoint,
} from '@app/shared/interfaces/stats.interface';
import { FootprintChartComponent } from '../../charts/footprint-chart/footprint-chart.component';
import { StatsBarCardComponent } from '../../stats/stats-bar-card/stats-bar-card.component';
import { UiChipGroupComponent } from '@app/shared/components/ui/ui-chip-group/ui-chip-group.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

type FootprintMetric = 'carbon' | 'water' | 'environmental-score';

interface MetricView {
    timestamps: string[];
    values: (number | null)[][];
    average: string;
}

interface AlignedMetric {
    times: number[];
    maps: Map<number, number>[];
}

interface TimeRange {
    id: string;
    label: string;
    days: number;
}

const EMPTY_METRIC: MetricView = { timestamps: [], values: [], average: '—' };
const EMPTY_ALIGNED: AlignedMetric = { times: [], maps: [] };

const DAY_MS = 24 * 60 * 60 * 1000;

const formatTimestamp = (ms: number): string =>
    new Date(ms).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    });

@Component({
    selector: 'app-zone-grid-tab',
    templateUrl: './zone-grid-tab.component.html',
    styleUrl: './zone-grid-tab.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,

    imports: [
        FormsModule,
        FootprintChartComponent,
        TranslatePipe,
        StatsBarCardComponent,
        UiChipGroupComponent,
    ],
})
export class ZoneGridTabComponent implements OnInit, OnChanges {
    private readonly appConfigService = inject(AppConfigService);

    @Input() datacentersStats: DatacenterStats[] = [];

    readonly timeRanges: TimeRange[] = [
        { id: '24h', label: '24h', days: 1 },
        { id: '7d', label: '7d', days: 7 },
        { id: '30d', label: '30d', days: 30 },
        { id: 'total', label: 'Total', days: Infinity },
    ];
    readonly rangeOptions = this.timeRanges.map((r) => ({
        value: r.id,
        viewValue: r.label,
    }));

    selectedRange = '30d';

    protected projectName = '';
    protected legend: string[] = [];

    protected greenScore: MetricView = EMPTY_METRIC;
    protected carbon: MetricView = EMPTY_METRIC;
    protected water: MetricView = EMPTY_METRIC;

    private aligned: Record<FootprintMetric, AlignedMetric> = {
        'environmental-score': EMPTY_ALIGNED,
        carbon: EMPTY_ALIGNED,
        water: EMPTY_ALIGNED,
    };

    ngOnInit(): void {
        this.projectName = this.appConfigService.projectName;
    }

    ngOnChanges(): void {
        this.legend = this.datacentersStats.map((dc) =>
            dc.country ? `${dc.name} (${dc.country})` : dc.name
        );

        this.aligned = {
            'environmental-score': this.alignSeries('environmental-score'),
            carbon: this.alignSeries('carbon'),
            water: this.alignSeries('water'),
        };

        this.applyRangeFilter();
    }

    onRangeChange(rangeId: string): void {
        this.selectedRange = rangeId;
        this.applyRangeFilter();
    }

    private applyRangeFilter(): void {
        const days = (
            this.timeRanges.find((r) => r.id === this.selectedRange) ??
            this.timeRanges[0]
        ).days;

        this.greenScore = this.buildMetric(
            this.aligned['environmental-score'],
            days,
            1
        );
        this.carbon = this.buildMetric(this.aligned.carbon, days, 0);
        this.water = this.buildMetric(this.aligned.water, days, 1);
    }

    private alignSeries(metric: FootprintMetric): AlignedMetric {
        const maps = this.datacentersStats.map(
            (dc) =>
                new Map<number, number>(
                    ((dc.footprints[metric] ?? []) as SeriesPoint[]).map(
                        ([t, v]): [number, number] => [new Date(t).getTime(), v]
                    )
                )
        );

        const times = [...new Set(maps.flatMap((m) => [...m.keys()]))].sort(
            (a, b) => a - b
        );

        return { times, maps };
    }

    private buildMetric(
        { times, maps }: AlignedMetric,
        days: number,
        decimals: number
    ): MetricView {
        if (!times.length) return EMPTY_METRIC;

        const cutoff =
            days === Infinity
                ? -Infinity
                : times[times.length - 1] - days * DAY_MS;
        const visible = times.filter((t) => t >= cutoff);

        const recent = maps.flatMap((m) =>
            visible
                .map((t) => m.get(t))
                .filter(
                    (v): v is number => v !== undefined && Number.isFinite(v)
                )
        );
        const average = recent.length
            ? (recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(
                  decimals
              )
            : '—';

        return {
            timestamps: visible.map(formatTimestamp),
            values: maps.map((m) => visible.map((t) => m.get(t) ?? null)),
            average,
        };
    }
}
