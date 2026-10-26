import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { getCssVar } from '@app/shared/utils/css-var.helper';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';

const SHADE_STEPS: [number, number][] = [
    [255, 0.35],
    [0, 0.3],
    [255, 0.6],
    [0, 0.5],
    [255, 0.8],
    [0, 0.65],
];

function parseColor(value: string): [number, number, number] | null {
    const v = value.trim();

    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
    if (hex) {
        const h =
            hex[1].length === 3
                ? hex[1]
                      .split('')
                      .map((c) => c + c)
                      .join('')
                : hex[1];
        return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [
            number,
            number,
            number,
        ];
    }

    const rgb =
        /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/i.exec(
            v
        );
    if (rgb) return [+rgb[1], +rgb[2], +rgb[3]];

    return null;
}

function buildShades(base: string): string[] {
    const rgb = parseColor(base);
    if (!rgb) return [base];

    const shades = SHADE_STEPS.map(([target, amount]) => {
        const [r, g, b] = rgb.map((c) => Math.round(c + (target - c) * amount));
        return `rgb(${r}, ${g}, ${b})`;
    });
    return [base, ...shades];
}

@Component({
    selector: 'app-footprint-chart',
    templateUrl: './footprint-chart.component.html',
    styleUrl: './footprint-chart.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgxEchartsDirective, UiButtonComponent],
})
export class FootprintChartComponent {
    @Input() title = '';
    @Input() tooltip?: string = '';
    @Input() set color(color: string) {
        if (!color) return;
        const base = color.startsWith('--') ? getCssVar(color) : color;
        this._colors = buildShades(base);
        this.updateChart();
    }
    @Input() set colors(colors: string[]) {
        if (colors && colors.length > 0) {
            this._colors = colors.map((color) =>
                color.startsWith('--') ? getCssVar(color) : color
            );
            this.updateChart();
        }
    }
    @Input() set unit(unit: string) {
        this._unit = unit;
    }
    @Input() set legend(legend: string[]) {
        this._legend = legend;
        this.updateChart();
    }
    @Input() set timestamps(timestamps: string[]) {
        this._timestamps = timestamps;
        this.updateChart();
    }
    @Input() set values(values: (number | null)[][]) {
        this._values = values;
        this.updateChart();
    }

    protected _unit = '';
    protected _legend: string[] = [];
    protected _timestamps: string[] = [];
    protected _values: (number | null)[][] = [];

    protected _colors = [
        getCssVar('--accent'),
        getCssVar('--primary'),
        getCssVar('--secondary'),
    ];

    protected echartOptions: EChartsOption = {
        color: this._colors,
        grid: {
            top: 16,
            right: 16,
            bottom: 48,
            left: 8,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            borderColor: getCssVar('--mat-sys-outline-variant'),
            borderWidth: 0.5,
            valueFormatter: (value) =>
                typeof value === 'number' ? value.toFixed(1) : '–',
        },
        legend: {
            type: 'scroll',
            data: [],
            bottom: 0,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: { fontSize: 11 },
        },
        yAxis: {
            type: 'value',
            scale: true,
            axisLabel: { fontSize: 11 },
        },
        series: [],
    };

    private updateChart(): void {
        if (!this._timestamps.length || !this._values.length) return;

        const series = this._values.map((values, index) => ({
            name: this._legend[index],
            type: 'line' as const,
            data: values,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2 },
            emphasis: { focus: 'series' as const },
        })) as EChartsOption['series'];

        this.echartOptions = {
            ...this.echartOptions,
            color: this._colors,
            legend: {
                ...(this.echartOptions.legend as object),
                data: this._legend,
            },
            xAxis: {
                ...(this.echartOptions.xAxis as object),
                data: this._timestamps,
            },
            series,
        };
    }
}
