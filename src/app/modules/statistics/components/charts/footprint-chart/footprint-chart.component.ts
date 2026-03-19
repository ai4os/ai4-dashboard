import { Component, Input } from '@angular/core';
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

    protected colours = ['#ff5b7f', '#008792', '#4a4a49'];
    protected echartOptions: EChartsOption = {
        color: this.colours,
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: [],
            bottom: 0,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true,
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
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
                data: this._legend,
                bottom: 0,
            },
            xAxis: {
                data: this._timestamps,
            },
            yAxis: {
                name: this._unit,
            },
            series,
        };
    }
}
