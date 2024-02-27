import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats-service/stats-service.service';
import {
    GlobalStats,
    ClusterStats,
    GpuStats,
    NodeStats,
    UserStats,
} from '@app/shared/interfaces/stats.interface';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    constructor(private statsService: StatsService) {}

    panelOpenState = false;
    userStatsLoading = false;
    clusterStatsLoading = false;

    // User global variable
    protected userGlobalStats: GlobalStats = {
        cpuNumAgg: 0,
        cpuNumTotal: 0,
        cpuMHzAgg: 0,
        cpuMHzTotal: 0,
        memoryMBAgg: 0,
        memoryMBTotal: 0,
        diskMBAgg: 0,
        diskMBTotal: 0,
        gpuNumAgg: 0,
        gpuNumTotal: 0,
    };

    // User aggregate variables
    protected cpuNumUserAgg = 0;
    protected cpuMHzUserAgg = 0;
    protected memoryMBUserAgg = 0;
    protected diskMBUserAgg = 0;
    protected gpuNumUserAgg = 0;

    // Namespace aggregate variables
    protected cpuNumNamespaceAgg = 0;
    protected cpuMHzNamespaceAgg = 0;
    protected memoryMBNamespaceAgg = 0;
    protected diskMBNamespaceAgg = 0;
    protected gpuNumNamespaceAgg = 0;

    // Time series variables
    protected dates: string[] = [];
    protected cpuMhzData: number[] = [];
    protected cpuNumData: number[] = [];
    protected memoryMBData: number[] = [];
    protected diskMBData: number[] = [];
    protected gpuNumData: number[] = [];
    protected queuedData: number[] = [];
    protected runningData: number[] = [];

    // Cluster global variable
    protected clusterGlobalStats!: GlobalStats;

    // Cluster aggregate variables
    protected cpuNumClusterAgg = 0;
    protected memoryMBClusterAgg = 0;
    protected diskMBClusterAgg = 0;
    protected gpuNumClusterAgg = 0;

    // Cluster total variables
    protected cpuNumClusterTotal = 0;
    protected memoryMBClusterTotal = 0;
    protected diskMBClusterTotal = 0;
    protected gpuNumClusterTotal = 0;

    // Cluster GPUs per model
    protected gpuPerModelCluster: GpuStats[] = [];

    // Nodes
    protected nodesCpu: NodeStats[] = [];
    protected nodesGpu: NodeStats[] = [];

    ngOnInit(): void {
        this.userStatsLoading = true;
        this.clusterStatsLoading = true;

        this.statsService
            .getUserStats()
            .subscribe((statsResponse: UserStats) => {
                // User aggregate
                if (statsResponse['users-agg']) {
                    this.cpuNumUserAgg = statsResponse['users-agg'].cpu_num;
                    this.cpuMHzUserAgg = Math.trunc(
                        statsResponse['users-agg'].cpu_MHz
                    );
                    this.memoryMBUserAgg = Math.trunc(
                        statsResponse['users-agg'].memory_MB
                    );
                    this.diskMBUserAgg = Math.trunc(
                        statsResponse['users-agg'].disk_MB
                    );
                    this.gpuNumUserAgg = statsResponse['users-agg'].gpu_num;

                    this.userGlobalStats.cpuNumAgg = this.cpuNumUserAgg;
                    this.userGlobalStats.cpuMHzAgg = this.cpuMHzUserAgg;
                    this.userGlobalStats.memoryMBAgg = this.memoryMBUserAgg;
                    this.userGlobalStats.diskMBAgg = this.diskMBUserAgg;
                    this.userGlobalStats.gpuNumAgg = this.gpuNumNamespaceAgg;
                }

                // Namespace aggregate variables
                if (statsResponse['full-agg']) {
                    this.cpuNumNamespaceAgg = statsResponse['full-agg'].cpu_num;
                    this.cpuMHzNamespaceAgg = Math.trunc(
                        statsResponse['full-agg'].cpu_MHz
                    );
                    this.memoryMBNamespaceAgg = Math.trunc(
                        statsResponse['full-agg'].memory_MB
                    );
                    this.diskMBNamespaceAgg = statsResponse['full-agg'].disk_MB;
                    this.gpuNumNamespaceAgg = statsResponse['full-agg'].gpu_num;

                    this.userGlobalStats.cpuNumTotal = this.cpuNumNamespaceAgg;
                    this.userGlobalStats.cpuMHzTotal = this.cpuMHzNamespaceAgg;
                    this.userGlobalStats.memoryMBTotal =
                        this.memoryMBNamespaceAgg;
                    this.userGlobalStats.diskMBTotal = this.diskMBNamespaceAgg;
                    this.userGlobalStats.gpuNumTotal = this.gpuNumNamespaceAgg;
                }

                // Timeseries
                this.dates = statsResponse.timeseries.date;
                this.cpuMhzData = statsResponse.timeseries.cpu_MHz;
                this.cpuNumData = statsResponse.timeseries.cpu_num;
                this.memoryMBData = statsResponse.timeseries.memory_MB;
                this.diskMBData = statsResponse.timeseries.disk_MB;
                this.gpuNumData = statsResponse.timeseries.gpu_num;
                this.queuedData = statsResponse.timeseries.queued;
                this.runningData = statsResponse.timeseries.running;

                this.userStatsLoading = false;
            });

        this.statsService
            .getClusterStats()
            .subscribe((statsResponse: ClusterStats) => {
                // Cluster
                if (statsResponse['cluster']) {
                    // Aggregate
                    this.cpuNumClusterAgg = statsResponse['cluster'].cpu_used;
                    this.memoryMBClusterAgg = Math.trunc(
                        statsResponse['cluster'].ram_used
                    );
                    this.diskMBClusterAgg = Math.trunc(
                        statsResponse['cluster'].disk_used
                    );
                    this.gpuNumClusterAgg = statsResponse['cluster'].gpu_used;
                    // Total
                    this.cpuNumClusterTotal =
                        statsResponse['cluster'].cpu_total;
                    this.memoryMBClusterTotal = Math.trunc(
                        statsResponse['cluster'].ram_total
                    );
                    this.diskMBClusterTotal = Math.trunc(
                        statsResponse['cluster'].disk_total
                    );
                    this.gpuNumClusterTotal =
                        statsResponse['cluster'].gpu_total;
                    this.gpuPerModelCluster =
                        statsResponse['cluster'].gpu_models;

                    this.clusterGlobalStats = {
                        cpuNumAgg: this.cpuNumClusterAgg,
                        cpuNumTotal: this.cpuNumClusterTotal,
                        memoryMBAgg: this.memoryMBClusterAgg,
                        memoryMBTotal: this.memoryMBClusterTotal,
                        diskMBAgg: this.diskMBClusterAgg,
                        diskMBTotal: this.diskMBClusterTotal,
                        gpuNumAgg: this.gpuNumClusterAgg,
                        gpuNumTotal: this.gpuNumClusterTotal,
                    };
                }

                // Nodes
                for (const node in statsResponse['nodes']) {
                    if (statsResponse['nodes'][node].gpu_total > 0) {
                        this.nodesGpu.push(statsResponse['nodes'][node]);
                    } else {
                        this.nodesCpu.push(statsResponse['nodes'][node]);
                    }
                }

                this.clusterStatsLoading = false;
            });
    }
}
