import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GpuStats } from '@app/shared/interfaces/stats.interface';
import { EChartsOption } from 'echarts';
import { GpuStatsDetailComponent } from '../gpu-stats-detail/gpu-stats-detail.component';

@Component({
    selector: 'app-stat-card',
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent implements OnInit {
    @Input() title = '';
    @Input() used_value = 0;
    @Input() total_value = 0;
    @Input() icon_name = '';
    @Input() memory_unit?: string;
    @Input() gpuPerModelCluster?: GpuStats[];

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        public dialog: MatDialog,
        public confirmationDialog: MatDialog
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    chartOptionsCommon: EChartsOption = {};
    colorPalette: string[] = [];

    getUnit(): string {
        let unit = '';
        if (this.memory_unit) {
            unit = this.memory_unit;
        }
        return unit;
    }

    ngOnInit(): void {
        this.setColours();

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

    setColours(): void {
        const r = document.querySelector(':root');
        const rs = getComputedStyle(r!);
        this.colorPalette = [rs.getPropertyValue('--accent'), '#d9d9d9'];
    }

    openDetailGpuStats(): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(GpuStatsDetailComponent, {
            data: { gpuStats: this.gpuPerModelCluster },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }
}