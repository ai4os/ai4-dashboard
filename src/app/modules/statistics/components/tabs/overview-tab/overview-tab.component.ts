import {
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { GpuStatsDetailComponent } from '../../gpu-stats-detail/gpu-stats-detail.component';
import { StatsReducedCardComponent } from '../../stats/stats-reduced-card/stats-reduced-card.component';
import { StatsBarCardComponent } from '../../stats/stats-bar-card/stats-bar-card.component';
import { ClusterViewModel } from '@app/shared/models/stats.view-models';
import { formatPower, scaleMiB } from '@app/shared/utils/stats.formatters';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';

interface ReducedItem {
    label: string;
    value: string | number;
    unit?: string;
    icon: string;
    color?: string;
}

@Component({
    selector: 'app-overview-tab',
    templateUrl: './overview-tab.component.html',
    styleUrls: ['./overview-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        TranslatePipe,
        StatsReducedCardComponent,
        StatsBarCardComponent,
        UiButtonComponent,
        UiLoaderComponent,
    ],
})
export class OverviewTabComponent implements OnInit, OnChanges {
    private readonly deploymentsService = inject(DeploymentsService);
    private readonly authService = inject(AuthService);
    private readonly dialog = inject(MatDialog);

    @Input({ required: true }) cluster!: ClusterViewModel;
    @Input() userPowerW: number | null = null;

    isLoading = false;
    userItems: ReducedItem[] = [];

    private jobsLoaded = false;
    private jobsNum = 0;
    private usedCpuNum = 0;
    private usedCpuMhz = 0;
    private usedMemoryMB = 0;
    private usedDiskMB = 0;
    private usedGpuNum = 0;
    private readonly power = 0;

    ngOnInit(): void {
        if (this.isLoggedIn()) this.getJobsList();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userPowerW'] && this.jobsLoaded) {
            this.userItems = this.buildUserItems();
        }
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    openGpuDetail(): void {
        this.dialog.open(GpuStatsDetailComponent, {
            data: { gpuStats: this.cluster.gpuModels },
            width: '650px',
            maxWidth: '95vw',
            autoFocus: false,
            restoreFocus: false,
            panelClass: 'ui-dialog-panel',
        });
    }

    private getJobsList(): void {
        this.isLoading = true;
        forkJoin({
            deployments: this.deploymentsService.getDeployments(),
            tools: this.deploymentsService.getTools(),
        }).subscribe({
            next: ({ deployments, tools }) => {
                this.addResources(deployments);
                this.addResources(tools);
                this.jobsLoaded = true;
                this.userItems = this.buildUserItems();
                this.isLoading = false;
            },
            error: () => {
                this.userItems = [];
                this.isLoading = false;
            },
        });
    }

    private addResources(jobs: Deployment[]): void {
        this.jobsNum += jobs.length;
        for (const job of jobs) {
            if (!job.resources) continue;
            this.usedCpuNum += job.resources.cpu_num;
            this.usedCpuMhz += job.resources.cpu_MHz;
            this.usedMemoryMB += job.resources.memory_MB;
            this.usedDiskMB += job.resources.disk_MB;
            this.usedGpuNum += job.resources.gpu_num;
        }
    }

    private buildUserItems(): ReducedItem[] {
        const mem = scaleMiB(this.usedMemoryMB);
        const disk = scaleMiB(this.usedDiskMB);
        const power =
            this.userPowerW !== null ? formatPower(this.userPowerW) : null;
        return [
            {
                label: 'DASHBOARD.STATS-TITLES.JOBS-NUM',
                value: this.jobsNum,
                icon: 'task',
            },
            {
                label: 'DASHBOARD.STATS-TITLES.CPU',
                value: this.usedCpuNum,
                icon: 'memory',
                color: 'var(--color-accent)',
            },
            {
                label: 'DASHBOARD.STATS-TITLES.CPU-FREQ',
                value: this.usedCpuMhz,
                unit: 'MHz',
                icon: 'graphic_eq',
                color: 'var(--color-accent-dark)',
            },
            {
                label: 'DASHBOARD.STATS-TITLES.RAM',
                value: mem.used,
                unit: mem.unit,
                icon: 'memory_alt',
                color: 'var(--color-secondary-4)',
            },
            {
                label: 'DASHBOARD.STATS-TITLES.DISK',
                value: disk.used,
                unit: disk.unit,
                icon: 'album',
                color: 'var(--color-primary-dark)',
            },
            {
                label: 'DASHBOARD.STATS-TITLES.GPU',
                value: this.usedGpuNum,
                icon: 'developer_board',
                color: 'var(--primary)',
            },
            {
                label: 'DASHBOARD.STATS-TITLES.POWER',
                value: power ? power.value : '—',
                unit: power?.unit,
                icon: 'bolt',
                color: 'var(--color-secondary-1)',
            },
        ];
    }
}
