import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GpuStats } from '@app/shared/interfaces/stats.interface';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-gpu-stats-detail',
    templateUrl: './gpu-stats-detail.component.html',
    styleUrls: ['./gpu-stats-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class GpuStatsDetailComponent implements OnInit {
    data = inject<{
        gpuStats: GpuStats[];
    }>(MAT_DIALOG_DATA);

    confirmationDialog = inject(MatDialog);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    isLoading = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    mappedStats: { type: string; value: GpuStats }[] = [];
    chartOptionsCommon: EChartsOption = {};
    colorPalette: string[] = [];

    ngOnInit(): void {
        this.setColours();

        this.mappedStats = Object.entries(this.data.gpuStats).map(
            ([type, value]) => ({ type, value })
        );

        this.chartOptionsCommon = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'value',
            },
            yAxis: {
                type: 'category',
                data: this.getGpuNames(),
            },
            series: [
                {
                    name: 'Used',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    data: this.getUsedGpus(),
                },
                {
                    name: 'Free',
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    data: this.getFreeGpus(),
                },
            ],
            color: this.colorPalette,
        };
    }

    setColours(): void {
        const r = document.querySelector(':root');
        const rs = getComputedStyle(r!);
        this.colorPalette = [rs.getPropertyValue('--accent'), '#d9d9d9'];
    }

    getGpuNames(): string[] {
        return this.mappedStats.map((s) => {
            return s.type;
        });
    }

    getUsedGpus(): number[] {
        return this.mappedStats.map((s) => {
            return s.value.gpu_used;
        });
    }

    getFreeGpus(): any[] {
        return this.mappedStats.map((s) => {
            const free = s.value.gpu_total - s.value.gpu_used;
            return free != 0 ? free : '-';
        });
    }
}
