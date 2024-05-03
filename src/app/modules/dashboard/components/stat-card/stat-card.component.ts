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
    @Input() usedValue = 0;
    @Input() totalValue = 0;
    @Input() iconName = '';
    @Input() memoryUnit?: string;
    @Input() gpuPerModelCluster?: GpuStats[];
    @Input() usedLabel? = 'Used';
    @Input() freeLabel? = 'Free';

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
        if (this.memoryUnit) {
            unit = this.memoryUnit;
        }
        return unit;
    }

    ngOnInit(): void {
        this.setColours();

        this.chartOptionsCommon = {
            title: {
                subtext:
                    'Used ' +
                    this.usedValue +
                    this.getUnit() +
                    ' of ' +
                    this.totalValue +
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
                        { value: this.usedValue, name: this.usedLabel },
                        {
                            value: this.totalValue - this.usedValue,
                            name: this.freeLabel,
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
