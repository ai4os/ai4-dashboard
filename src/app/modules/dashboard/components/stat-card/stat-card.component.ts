import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-stat-card',
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent implements OnInit {
    @Input() title: string = '';
    @Input() used_value: number = 0;
    @Input() total_value: number = 0;
    @Input() icon_name: string = '';
    @Input() memory_unit?: string;

    chartOptionsCommon: EChartsOption = {};
    colorPalette = ['#008792', '#d9d9d9'];

    getUnit(): string {
        let unit = '';
        if (this.memory_unit) {
            unit = this.memory_unit;
        }
        return unit;
    }

    ngOnInit(): void {
        this.chartOptionsCommon = {
            title: {
                subtext:
                    'Used ' +
                    this.used_value +
                    this.getUnit() +
                    ' of ' +
                    this.total_value +
                    this.getUnit(),
                left: 'center',
                subtextStyle: {
                    fontSize: '0.9em',
                },
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                top: 'bottom',
            },
            series: [
                {
                    name: this.title,
                    type: 'pie',
                    radius: [60],
                    data: [
                        { value: this.used_value, name: 'Used' },
                        {
                            value: this.total_value - this.used_value,
                            name: 'Free',
                        },
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        scale: true,
                        scaleSize: 10,
                    },
                    color: this.colorPalette,
                },
            ],
        };
    }
}
