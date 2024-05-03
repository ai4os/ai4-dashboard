import { Component, Input, OnInit } from '@angular/core';
import { DeploymentsService } from '@app/modules/deployments/services/deployments.service';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { GlobalStats, GpuStats } from '@app/shared/interfaces/stats.interface';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-overview-tab',
    templateUrl: './overview-tab.component.html',
    styleUrls: ['./overview-tab.component.scss'],
})
export class OverviewTabComponent implements OnInit {
    constructor(private deploymentsService: DeploymentsService) {}

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
        this.getJobsList();
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
}
