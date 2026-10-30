import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Input,
    OnChanges,
    OnInit,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UiChipGroupComponent } from '@app/shared/components/ui/ui-chip-group/ui-chip-group.component';

import {
    POWER_UNITS,
    CARBON_UNITS,
    ENERGY_UNITS,
    UnitStep,
    WATER_UNITS,
    decimalsFor,
    pickUnit,
} from '@app/shared/utils/stats.formatters';
import { FootprintChartComponent } from '../../charts/footprint-chart/footprint-chart.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import {
    FootprintMetric,
    EnergyGroup,
    FOOTPRINT_RANGES,
    FootprintRange,
    FootprintView,
    emptyView,
    formatDateLabel,
    buildFootprintView,
    formatBucketLabel,
    MetricMatrix,
    maxStacked,
    scaleMatrix,
} from '../../../energy-footprint';
import { MatDivider } from '@angular/material/divider';

type ChartView = 'period' | 'cumulative';

interface MetricColumn {
    id: FootprintMetric;
    labelKey: string;
    icon: string;
    /** `var(--color-…)`  */
    cardColor: string;
    /** CSS variable name */
    color: string;
    unit: string;
    chartUnit: string;
    total: string;
    decimals: number;
    values: (number | null)[][];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const METRIC_DEFS: Record<
    FootprintMetric,
    { metricKey: string; icon: string; color: string; units: UnitStep[] }
> = {
    powerW: {
        metricKey: 'STATS.METRICS.SUSTAINABILITY.POWER',
        icon: 'battery_charging_full',
        color: '--color-secondary-2',
        units: POWER_UNITS,
    },
    energyWh: {
        metricKey: 'STATS.METRICS.SUSTAINABILITY.ENERGY',
        icon: 'bolt',
        color: '--color-secondary-1',
        units: ENERGY_UNITS,
    },
    carbonG: {
        metricKey: 'STATS.METRICS.SUSTAINABILITY.CARBON.TITLE',
        icon: 'factory',
        color: '--color-secondary-5',
        units: CARBON_UNITS,
    },
    waterL: {
        metricKey: 'STATS.METRICS.SUSTAINABILITY.WATER.TITLE',
        icon: 'water_drop',
        color: '--color-secondary-3',
        units: WATER_UNITS,
    },
};

@Component({
    selector: 'app-energy-footprint',
    templateUrl: './energy-footprint.component.html',
    styleUrl: './energy-footprint.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        TranslatePipe,
        UiChipGroupComponent,
        StatsCardComponent,
        FootprintChartComponent,
        MatDivider,
    ],
})
export class EnergyFootprintComponent implements OnInit, OnChanges {
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);

    @Input() groups: EnergyGroup[] = [];
    @Input() since: string | null = null;
    @Input() until: string | null = null;
    @Input() titleKey = '';
    @Input() subtitleKey = '';
    @Input() energyLabelKey = 'STATS.VALUES.ENERGY';

    readonly rangeOptions = FOOTPRINT_RANGES.map((r) => ({
        value: r.id,
        viewValue: r.label,
    }));
    viewOptions: { value: ChartView; viewValue: string }[] = [];

    selectedRange: FootprintRange = '30d';
    selectedView: ChartView = 'period';

    view: FootprintView = emptyView();
    hasData = false;
    sinceLabel = '';
    untilLabel = '';
    columns: MetricColumn[] = [];
    labels: string[] = [];
    legend: string[] = [];

    ngOnInit(): void {
        this.translate
            .stream([
                'STATS.CHARTS.VIEW-MODE.PER-PERIOD',
                'STATS.CHARTS.VIEW-MODE.CUMULATIVE',
            ])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((t) => {
                this.viewOptions = [
                    {
                        value: 'period',
                        viewValue: t['STATS.CHARTS.VIEW-MODE.PER-PERIOD'],
                    },
                    {
                        value: 'cumulative',
                        viewValue: t['STATS.CHARTS.VIEW-MODE.CUMULATIVE'],
                    },
                ];
            });
    }

    ngOnChanges(): void {
        this.legend =
            this.groups.length > 1 ? this.groups.map((g) => g.name) : [];
        this.rebuild();
    }

    onRangeChange(range: FootprintRange): void {
        this.selectedRange = range;
        this.rebuild();
    }

    onViewChange(view: ChartView): void {
        this.selectedView = view;
        this.rebuildColumns();
    }

    private rebuild(): void {
        this.view = buildFootprintView(this.groups, this.selectedRange);
        this.hasData = this.view.timestamps.length > 0;
        this.labels = this.view.timestamps.map((t) =>
            formatBucketLabel(t, this.view.grouping)
        );

        const ts = this.view.timestamps;
        this.sinceLabel = ts.length ? formatDateLabel(ts[0]) : '';
        this.untilLabel = ts.length ? formatDateLabel(ts[ts.length - 1]) : '';

        this.rebuildColumns();
    }

    private rebuildColumns(): void {
        const cumulative = this.selectedView === 'cumulative';

        this.columns = (Object.keys(METRIC_DEFS) as FootprintMetric[]).map(
            (id) => {
                const def = METRIC_DEFS[id];

                // Power values must be always displayed per period
                const useCumulative = cumulative && id !== 'powerW';

                const matrix: MetricMatrix = useCumulative
                    ? this.view.cumulative[id]
                    : this.view.perPeriod[id];

                const max = maxStacked(matrix);
                const chartStep = pickUnit(max, def.units);

                const totalStep = pickUnit(this.view.totals[id], def.units);
                const total = this.view.totals[id] / totalStep.factor;

                return {
                    id,
                    labelKey:
                        id === 'energyWh' ? this.energyLabelKey : def.metricKey,
                    icon: def.icon,
                    cardColor: `var(${def.color})`,
                    color: def.color,
                    unit: totalStep.unit, // card unit
                    total: total.toLocaleString('en-GB', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: decimalsFor(total),
                    }),
                    chartUnit: chartStep.unit, // chart unit
                    decimals: decimalsFor(max / chartStep.factor),
                    values: scaleMatrix(matrix, chartStep.factor),
                };
            }
        );
    }
}
