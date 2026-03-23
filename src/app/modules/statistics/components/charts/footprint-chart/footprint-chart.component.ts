import { Component, Input } from '@angular/core';
import { getCssVar } from '@app/shared/utils/css-var.helper';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-footprint-chart',
    templateUrl: './footprint-chart.component.html',
    styleUrl: './footprint-chart.component.scss',
})
export class FootprintChartComponent {
    @Input() title: string = '';
    @Input() tooltip?: string = '';
    @Input() set unit(unit: string) {
        this._unit = unit;
        this.updateChart();
    }
    @Input() set legend(legend: string[]) {
        this._legend = legend;
        this.updateChart();
    }
    @Input() set timestamps(timestamps: string[]) {
        this._timestamps = timestamps;
        this.updateChart();
    }
    @Input() set values(values: number[][]) {
        this._values = values;
        this.updateChart();
    }

    protected _unit: string = '';
    protected _legend: string[] = [];
    protected _timestamps: string[] = [];
    protected _values: number[][] = [];

    protected colours = [
        getCssVar('--accent'),
        getCssVar('--primary'),
        getCssVar('--secondary'),
    ];

    protected echartOptions: EChartsOption = {
        color: this.colours,
        grid: {
            top: 12,
            right: 40,
            bottom: 48,
            left: 40,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            borderColor: getCssVar('--mat-sys-outline-variant'),
            borderWidth: 0.5,
        },
        legend: {
            data: [],
            bottom: 0,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
        },
        yAxis: {
            name: '',
            type: 'value',
        },
        series: [],
    };

    private updateChart(): void {
        if (!this._timestamps.length || !this._values.length) return;

        const series = this._values.map((values, index) => ({
            name: this._legend[index],
            type: 'line' as const,
            data: values,
        })) as EChartsOption['series'];

        this.echartOptions = {
            ...this.echartOptions,
            legend: {
                ...(this.echartOptions.legend as object),
                data: this._legend,
            },
            xAxis: {
                ...(this.echartOptions.xAxis as object),
                data: this._timestamps,
            },
            yAxis: {
                ...(this.echartOptions.yAxis as object),
                name: this._unit,
            },
            series,
        };
    }
}
