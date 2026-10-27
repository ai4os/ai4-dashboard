import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    inject,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { ResourceSet } from '@app/shared/models/stats.view-models';
import { formatPower, scaleMiB } from '@app/shared/utils/stats.formatters';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { StatsCardComponent } from '../../stats/stats-card/stats-card.component';

interface ReducedItem {
    label: string;
    value: string | number;
    unit?: string;
    icon: string;
    color?: string;
}

@Component({
    selector: 'app-user-usage-tab',
    templateUrl: './user-usage-tab.component.html',
    styleUrls: ['./user-usage-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe, StatsCardComponent, UiLoaderComponent],
})
export class UserUsageTabComponent implements OnInit, OnChanges {
    private readonly deploymentsService = inject(DeploymentsService);

    @Input({ required: true }) usage!: ResourceSet;
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

    ngOnInit(): void {
        this.getJobsList();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userPowerW'] && this.jobsLoaded) {
            this.userItems = this.buildUserItems();
        }
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
                label: 'STATS.METRICS.RESOURCES.JOBS-NUM',
                value: this.jobsNum,
                icon: 'task',
            },
            {
                label: 'STATS.METRICS.RESOURCES.CPU',
                value: this.usedCpuNum,
                icon: 'memory',
                color: 'var(--color-accent)',
            },
            {
                label: 'STATS.METRICS.RESOURCES.CPU-FREQ',
                value: this.usedCpuMhz,
                unit: 'MHz',
                icon: 'graphic_eq',
                color: 'var(--color-accent-dark)',
            },
            {
                label: 'STATS.METRICS.RESOURCES.RAM',
                value: mem.used,
                unit: mem.unit,
                icon: 'memory_alt',
                color: 'var(--color-secondary-4)',
            },
            {
                label: 'STATS.METRICS.RESOURCES.DISK',
                value: disk.used,
                unit: disk.unit,
                icon: 'album',
                color: 'var(--color-primary-dark)',
            },
            {
                label: 'STATS.METRICS.RESOURCES.GPU',
                value: this.usedGpuNum,
                icon: 'developer_board',
                color: 'var(--primary)',
            },
            {
                label: 'STATS.METRICS.SUSTAINABILITY.POWER',
                value: power ? power.value : '—',
                unit: power?.unit,
                icon: 'bolt',
                color: 'var(--color-secondary-1)',
            },
        ];
    }
}
