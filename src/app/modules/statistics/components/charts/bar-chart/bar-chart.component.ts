import { Component, Input, OnInit } from '@angular/core';
import { getCssVar } from '@app/shared/utils/css-var.helper';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
    @Input() title: string = '';
    @Input() tooltip?: string = '';
    @Input() set categories(categories: string[]) {
        this._categories = categories;
        this.updateChart();
    }
    @Input() set values(values: number[]) {
        this._values = values;
        this.updateChart();
    }

    protected _categories: string[] = [];
    protected _values: number[] = [];

    protected colour = getCssVar('--accent');

    protected echartOptions: EChartsOption = {
        color: this.colour,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        xAxis: {
            type: 'category',
            data: [],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [],
                type: 'bar',
            },
        ],
    };

    ngOnInit(): void {
        this.updateChart();
    }

    private updateChart(): void {
        if (!this._categories.length && !this._values.length) return;

        this.echartOptions = {
            ...this.echartOptions,
            xAxis: {
                type: 'category',
                data: this._categories,
            },
            series: [
                {
                    data: this._values.map((v) => ({ value: v })),
                    type: 'bar',
                },
            ],
        };
    }
}
