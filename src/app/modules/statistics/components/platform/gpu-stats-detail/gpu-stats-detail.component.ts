import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogClose,
    MatDialogContent,
    MatDialogActions,
} from '@angular/material/dialog';
import { NgxEchartsDirective } from 'ngx-echarts';
import { TranslatePipe } from '@ngx-translate/core';
import { EChartsOption } from 'echarts';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { GpuModelUsage } from '@app/shared/models/stats.view-models';

@Component({
    selector: 'app-gpu-stats-detail',
    templateUrl: './gpu-stats-detail.component.html',
    styleUrls: ['./gpu-stats-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatDialogClose,
        MatDialogContent,
        MatDialogActions,
        NgxEchartsDirective,
        TranslatePipe,
        UiButtonComponent,
    ],
})
export class GpuStatsDetailComponent implements OnInit {
    data = inject<{ gpuStats: GpuModelUsage[] }>(MAT_DIALOG_DATA);
    mappedStats: GpuModelUsage[] = [];

    chartOptions: EChartsOption = {};
    chartHeight = 200;

    private readonly rowHeight = 48;
    private readonly chromeHeight = 70;

    ngOnInit(): void {
        this.mappedStats = this.data.gpuStats;
        this.chartHeight = Math.max(
            180,
            this.mappedStats.length * this.rowHeight + this.chromeHeight
        );
        this.chartOptions = this.buildOptions();
    }

    private css(name: string, fallback: string): string {
        const v = getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        return v || fallback;
    }

    private buildOptions(): EChartsOption {
        const usedColor = this.css('--primary', '#e07b27');
        const freeColor = this.css('--color-border', '#e5e7eb');
        const textColor = this.css('--color-text-secondary', '#6e6a60');
        const gridLine = 'rgba(0, 0, 0, 0.06)';
        const fontFamily = getComputedStyle(document.body).fontFamily;

        const hideZero = (p: any) => (p.value > 0 ? p.value : '');

        return {
            textStyle: { fontFamily, color: textColor },
            color: [usedColor, freeColor],
            animationDuration: 500,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: { color: 'rgba(0,0,0,0.04)' },
                },
                backgroundColor: '#fff',
                borderColor: this.css('--color-border', '#e5e7eb'),
                borderWidth: 1,
                padding: [8, 12],
                textStyle: {
                    color: this.css('--mat-sys-on-surface', '#242320'),
                    fontSize: 12,
                },
                extraCssText:
                    'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);',
            },
            legend: {
                top: 0,
                right: 0,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 16,
                textStyle: { color: textColor, fontSize: 12 },
            },
            grid: { left: 0, right: 8, top: 32, bottom: 0, containLabel: true },
            xAxis: {
                type: 'value',
                minInterval: 1,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: textColor, fontSize: 11 },
                splitLine: { lineStyle: { color: gridLine, type: 'dashed' } },
            },
            yAxis: {
                type: 'category',
                inverse: true,
                data: this.mappedStats.map((s) => s.model),
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: textColor, fontSize: 12, margin: 12 },
            },
            series: [
                {
                    name: 'Used',
                    type: 'bar',
                    stack: 'total',
                    barWidth: 18,
                    itemStyle: { borderRadius: [6, 0, 0, 6] },
                    label: {
                        show: true,
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        formatter: hideZero,
                    },
                    emphasis: { focus: 'series' },
                    data: this.mappedStats.map((s) => s.used),
                },
                {
                    name: 'Free',
                    type: 'bar',
                    stack: 'total',
                    barWidth: 18,
                    itemStyle: { borderRadius: [0, 6, 6, 0] },
                    label: {
                        show: true,
                        color: textColor,
                        fontSize: 11,
                        formatter: hideZero,
                    },
                    emphasis: { focus: 'series' },
                    data: this.mappedStats.map((s) => s.total - s.used),
                },
            ],
        };
    }
}
