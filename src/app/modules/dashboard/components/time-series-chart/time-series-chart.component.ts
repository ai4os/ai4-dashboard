import { Component, Input, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats/stats.service';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-time-series-chart',
    templateUrl: './time-series-chart.component.html',
    styleUrls: ['./time-series-chart.component.scss'],
})
export class TimeSeriesChartComponent implements OnInit {
    constructor(private statsService: StatsService) {}

    chartOptionsCommon: EChartsOption = {};
    chartOptionsData: EChartsOption = {};
    colorPalette: string[] = [];

    protected _datesInput: string[] = [];
    protected _dataInput: string[] | number[] = [];
    protected _chartNameInput = '';

    @Input() set datesInput(datesInput: string[]) {
        this._datesInput = datesInput;
        this.chartOptionsData.xAxis = [{ data: datesInput }];
    }

    @Input() set dataInput(dataInput: string[] | number[]) {
        this._dataInput = dataInput;
        this.chartOptionsData.series = [{ data: dataInput }];
    }

    @Input() set nameInput(chartNameInput: string) {
        this._chartNameInput = chartNameInput;
        this.chartOptionsData.series = [{ name: chartNameInput }];
    }

    ngOnInit(): void {
        this.setColours();

        this.chartOptionsCommon = {
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                },
            ],
            yAxis: [
                {
                    type: 'value',
                },
            ],
            toolbox: {
                feature: {
                    saveAsImage: { name: this._chartNameInput },
                },
            },
            tooltip: {
                trigger: 'axis',
            },
            series: [
                {
                    silent: true,
                    type: 'line',
                    stack: 'Total',
                    label: {
                        show: false,
                        formatter: '{c}',
                        position: 'inside',
                    },
                    color: this.colorPalette,
                },
            ],
        };
    }

    setColours(): void {
        const r = document.querySelector(':root');
        const rs = getComputedStyle(r!);
        this.colorPalette = [rs.getPropertyValue('--accent'), '#d9d9d9'];
    }
}
