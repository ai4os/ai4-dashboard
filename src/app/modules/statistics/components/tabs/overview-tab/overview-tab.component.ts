import {
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { GlobalStats, GpuStats } from '@app/shared/interfaces/stats.interface';
import { forkJoin } from 'rxjs';
import { MatToolbar } from '@angular/material/toolbar';
import { StatsContainerComponent } from '../../stats-container/stats-container.component';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-overview-tab',
    templateUrl: './overview-tab.component.html',
    styleUrls: ['./overview-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatToolbar,
        StatsContainerComponent,
        MatCard,
        MatIcon,
        MatProgressSpinner,
        TranslatePipe,
    ],
})
export class OverviewTabComponent implements OnInit {
    deploymentsService = inject(DeploymentsService);
    authService = inject(AuthService);

    @Input() clusterGlobalStats!: GlobalStats;
    @Input() gpuPerModelCluster!: GpuStats[];

    Math = Math;
    isLoading = false;
    jobs: Deployment[] = [];
    jobsNum = 0;
    ramUnit = 'MiB';
    diskUnit = 'MiB';
    usedCpuNum = 0;
    usedCpuMhz = 0;
    usedMemory = 0;
    usedDisk = 0;
    usedGpuNum = 0;

    ngOnInit(): void {
        if (this.isLoggedIn()) {
            this.getJobsList();
        }
    }

    getJobsList() {
        this.isLoading = true;
        forkJoin({
            deployments: this.deploymentsService.getDeployments(),
            tools: this.deploymentsService.getTools(),
        }).subscribe((jobs) => {
            this.addResources(jobs.deployments);
            this.addResources(jobs.tools);
            this.setMemoryConfig();
            this.setDiskConfig();
            this.isLoading = false;
        });
    }

    addResources(jobs: Deployment[]) {
        this.jobsNum += jobs.length;
        for (const j in jobs) {
            if (jobs[j].resources) {
                this.usedCpuNum += jobs[j].resources!.cpu_num;
                this.usedCpuMhz += jobs[j].resources!.cpu_MHz;
                this.usedMemory += jobs[j].resources!.memory_MB;
                this.usedDisk += jobs[j].resources!.disk_MB;
                this.usedGpuNum += jobs[j].resources!.gpu_num;
            }
        }
    }

    setMemoryConfig() {
        if (this.usedMemory > 1000) {
            // use GiB
            this.ramUnit = 'GiB';
            this.usedMemory = this.usedMemory / Math.pow(2, 10);
        }
    }

    setDiskConfig() {
        if (this.usedDisk > 1000) {
            // use GiB
            this.diskUnit = 'GiB';
            this.usedDisk = this.usedDisk / Math.pow(2, 10);
        }
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
}
