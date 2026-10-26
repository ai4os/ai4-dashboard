import {
    Component,
    Input,
    OnChanges,
    ChangeDetectionStrategy,
} from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';

@Component({
    selector: 'app-time-series-chart',
    templateUrl: './time-series-chart.component.html',
    styleUrls: ['./time-series-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgxEchartsDirective, UiCardComponent],
})
export class TimeSeriesChartComponent implements OnChanges {
    @Input() dates: string[] = [];
    @Input() values: number[] = [];
    @Input() name = '';
    @Input() unit = '';
    @Input() color = '--accent';
    @Input() decimals = 0;
    @Input() height = 340;

    chartOptions: EChartsOption = {};

    ngOnChanges(): void {
        this.chartOptions = this.buildOptions();
    }

    private css(name: string, fallback: string): string {
        const v = getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        return v || fallback;
    }

    private fmt(v: number): string {
        const f = 10 ** this.decimals;
        return `${Math.round(v * f) / f}${this.unit ? ' ' + this.unit : ''}`;
    }

    private buildOptions(): EChartsOption {
        const color = this.css(this.color, '#e07b27');
        const text = this.css('--color-text-secondary', '#6e6a60');
        const border = this.css('--color-border', '#e5e7eb');
        const onSurface = this.css('--mat-sys-on-surface', '#242320');
        const fontFamily = getComputedStyle(document.body).fontFamily;

        return {
            textStyle: { fontFamily, color: text },
            color: [color],
            animationDuration: 500,
            grid: {
                left: 8,
                right: 16,
                top: 48,
                bottom: 24,
                containLabel: true,
            },
            toolbox: {
                right: 8,
                top: 0,
                feature: { saveAsImage: { name: this.name, title: '' } },
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fff',
                borderColor: border,
                borderWidth: 1,
                padding: [8, 12],
                textStyle: { color: onSurface, fontSize: 12 },
                extraCssText:
                    'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);',
                axisPointer: { lineStyle: { color: border } },
                formatter: (params: any) => {
                    const p = Array.isArray(params) ? params[0] : params;
                    return `<div style="font-size:11px;color:${text}">${p.axisValue}</div>
                            <div style="font-weight:600">${this.fmt(p.value)}</div>`;
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.dates,
                axisLine: { lineStyle: { color: border } },
                axisTick: { show: false },
                axisLabel: {
                    color: text,
                    fontSize: 11,
                    formatter: (v: string) => v.slice(5),
                },
            },
            yAxis: {
                type: 'value',
                max: (v: { max: number }) => v.max * 1.15,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: text,
                    fontSize: 11,
                    formatter: (v: number) => this.fmt(v),
                },
                splitLine: {
                    lineStyle: { color: 'rgba(0,0,0,0.06)', type: 'dashed' },
                },
            },
            dataZoom: [{ type: 'inside' }],
            series: [
                {
                    name: this.name,
                    type: 'line',
                    data: this.values,
                    smooth: 0.25,
                    showSymbol: this.values.length <= 1,
                    lineStyle: { width: 2 },
                    emphasis: { focus: 'series' },
                    areaStyle: {
                        opacity: 0.25,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color },
                                { offset: 1, color: 'transparent' },
                            ],
                        },
                    },
                    markPoint: {
                        symbolSize: this.peakSize(),
                        label: {
                            fontSize: 10,
                            color: '#fff',
                            formatter: (p: any) => this.peakLabel(p.value),
                        },
                        data: [{ type: 'max', name: 'max' }],
                    },
                },
            ],
        };
    }

    private peakLabel(v: number): string {
        return v >= 100 ? `${Math.round(v)}` : `${Math.round(v * 10) / 10}`;
    }

    private peakSize(): number {
        const max = this.values.length ? Math.max(...this.values) : 0;
        return Math.max(40, this.peakLabel(max).length * 9 + 12);
    }
}
