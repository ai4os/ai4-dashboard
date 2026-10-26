import {
    Component,
    Input,
    OnChanges,
    ChangeDetectionStrategy,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
    DatacenterStats,
    SeriesPoint,
} from '@app/shared/interfaces/stats.interface';
import { FootprintChartComponent } from '../../charts/footprint-chart/footprint-chart.component';
import { StatsBarCardComponent } from '../../stats/stats-bar-card/stats-bar-card.component';

type FootprintMetric = 'carbon' | 'water' | 'environmental-score';

interface MetricView {
    timestamps: string[];
    values: (number | null)[][];
    average: string;
}

const EMPTY_METRIC: MetricView = { timestamps: [], values: [], average: '—' };

const WINDOW_DAYS = 30;
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
    selector: 'app-footprint-tab',
    templateUrl: './footprint-tab.component.html',
    styleUrl: './footprint-tab.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FootprintChartComponent, TranslatePipe, StatsBarCardComponent],
})
export class FootprintTabComponent implements OnChanges {
    @Input() datacentersStats: DatacenterStats[] = [];

    protected readonly windowDays = WINDOW_DAYS;

    protected legend: string[] = [];

    protected greenScore: MetricView = EMPTY_METRIC;
    protected carbon: MetricView = EMPTY_METRIC;
    protected water: MetricView = EMPTY_METRIC;

    ngOnChanges(): void {
        this.legend = this.datacentersStats.map((dc) =>
            dc.country ? `${dc.name} (${dc.country})` : dc.name
        );

        this.greenScore = this.buildMetric('environmental-score', 1);
        this.carbon = this.buildMetric('carbon', 0);
        this.water = this.buildMetric('water', 1);
    }

    private buildMetric(metric: FootprintMetric, decimals: number): MetricView {
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
        if (!times.length) return EMPTY_METRIC;

        const cutoff = times[times.length - 1] - WINDOW_DAYS * DAY_MS;
        const recent = maps.flatMap((m) =>
            [...m]
                .filter(([t, v]) => t >= cutoff && Number.isFinite(v))
                .map(([, v]) => v)
        );
        const average = recent.length
            ? (recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(
                  decimals
              )
            : '—';

        return {
            timestamps: times.map(formatTimestamp),
            values: maps.map((m) => times.map((t) => m.get(t) ?? null)),
            average,
        };
    }
}
