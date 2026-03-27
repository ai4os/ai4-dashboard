import { Component, Input, OnInit } from '@angular/core';
import { CountryFlagPipe } from '@app/modules/statistics/pipes/country-flag.pipe';
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
    @Input() set countries(countries: string[]) {
        this._countries = countries;
        this.updateChart();
    }

    private countryFlagPipe = new CountryFlagPipe();

    protected _categories: string[] = [];
    protected _values: number[] = [];
    protected _countries: string[] = [];

    protected echartOptions: EChartsOption = {
        color: [getCssVar('--accent')],
        grid: {
            top: 12,
            right: 40,
            bottom: 24,
            left: 40,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            borderColor: getCssVar('--mat-sys-outline-variant'),
            borderWidth: 0.5,
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
                barMaxWidth: 80,
                itemStyle: { borderRadius: [4, 4, 0, 0] },
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
                ...(this.echartOptions.xAxis as object),
                data: this._categories,
                axisLabel: {
                    formatter: (value: string, index: number) => {
                        const flag = this.countryFlagPipe.transform(
                            this._countries[index]
                        );
                        return flag ? `${flag} ${value}` : value;
                    },
                },
            },
            series: [
                {
                    ...(this.echartOptions.series as any[])[0],
                    data: this._values.map((v) => ({ value: v })),
                },
            ],
        };
    }
}
