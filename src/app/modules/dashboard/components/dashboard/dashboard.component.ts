import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats-service/stats-service.service';
import {
    ClusterStats,
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

    // User aggregate variables
    protected cpuNumUserAgg = '0';
    protected cpuMHzUserAgg = '0';
    protected memoryMBUserAgg = '0';
    protected diskMBUserAgg = '0';
    protected gpunumUserAgg = '0';

    // Namespace aggregate variables
    protected cpuNumNamespaceAgg = '0';
    protected cpuMHzNamespaceAgg = '0';
    protected memoryMBNamespaceAgg = '0';
    protected diskMBNamespaceAgg = '0';
    protected gpunumNamespaceAgg = '0';

    // Time series variables
    protected dates: string[] = [];
    protected cpuMhzData: number[] = [];
    protected cpuNumData: number[] = [];
    protected memoryMBData: number[] = [];
    protected diskMBData: number[] = [];
    protected gpuNumData: number[] = [];
    protected queuedData: number[] = [];
    protected runningData: number[] = [];

    // Cluster aggregate variables
    protected cpuNumClusterAgg = '0';
    protected cpuMHzClusterAgg = '0';
    protected memoryMBClusterAgg = '0';
    protected diskMBClusterAgg = '0';
    protected gpunumClusterAgg = '0';

    // Cluster total variables
    protected cpuNumClusterTotal = '0';
    protected cpuMHzClusterTotal = '0';
    protected memoryMBClusterTotal = '0';
    protected diskMBClusterTotal = '0';
    protected gpunumClusterTotal = '0';

    // Nodes
    protected nodes: any;

    ngOnInit(): void {
        this.userStatsLoading = true;
        this.clusterStatsLoading = true;

        this.statsService
            .getUserStats()
            .subscribe((statsResponse: UserStats) => {
                // User aggregate
                if (statsResponse['users-agg']) {
                    this.cpuNumUserAgg =
                        statsResponse['users-agg'].cpu_num.toString();
                    this.cpuMHzUserAgg =
                        statsResponse['users-agg'].cpu_MHz.toString();
                    this.memoryMBUserAgg =
                        statsResponse['users-agg'].memory_MB.toString();
                    this.diskMBUserAgg =
                        statsResponse['users-agg'].disk_MB.toString();
                    this.gpunumUserAgg =
                        statsResponse['users-agg'].gpu_num.toString();
                }

                // Namespace aggregate variables
                if (statsResponse['full-agg']) {
                    this.cpuNumNamespaceAgg =
                        statsResponse['full-agg'].cpu_num.toString();
                    this.cpuMHzNamespaceAgg =
                        statsResponse['full-agg'].cpu_MHz.toString();
                    this.memoryMBNamespaceAgg =
                        statsResponse['full-agg'].memory_MB.toString();
                    this.diskMBNamespaceAgg =
                        statsResponse['full-agg'].memory_MB.toString();
                    this.gpunumNamespaceAgg =
                        statsResponse['full-agg'].memory_MB.toString();
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
                    this.cpuNumClusterAgg =
                        statsResponse['cluster'].cpu_used.toString();
                    this.memoryMBClusterAgg = statsResponse['cluster'].ram_used
                        .toFixed(0)
                        .toString();
                    this.diskMBClusterAgg = statsResponse['cluster'].disk_used
                        .toFixed(0)
                        .toString();
                    this.gpunumClusterAgg =
                        statsResponse['cluster'].gpu_used.toString();
                    // Total
                    this.cpuNumClusterTotal =
                        statsResponse['cluster'].cpu_total.toString();
                    this.memoryMBClusterTotal = statsResponse[
                        'cluster'
                    ].ram_total
                        .toFixed(0)
                        .toString();
                    this.diskMBClusterTotal = statsResponse[
                        'cluster'
                    ].disk_total
                        .toFixed(0)
                        .toString();
                    this.gpunumClusterTotal =
                        statsResponse['cluster'].gpu_total.toString();
                }

                // Nodes
                this.nodes = Object.entries(statsResponse['nodes']).map(
                    (e) => ({ [e[0]]: e[1] })
                );

                this.clusterStatsLoading = false;
            });
    }

    getNodeId(node: any): string {
        return Object.getOwnPropertyNames(node)[0];
    }

    getCpuUsed(node: any): string {
        let id = Object.getOwnPropertyNames(node)[0];
        return node[id].cpu_used;
    }

    getMemoryUsed(node: any): string {
        let id = Object.getOwnPropertyNames(node)[0];
        return node[id].ram_used.toFixed(0);
    }

    getDiskUsed(node: any): string {
        let id = Object.getOwnPropertyNames(node)[0];
        return node[id].disk_used.toFixed(0);
    }

    getGpuUsed(node: any): string {
        let id = Object.getOwnPropertyNames(node)[0];
        return node[id].gpu_used;
    }

    getCpuTotal(node: any): string {
        let id = Object.getOwnPropertyNames(node)[0];
        return node[id].cpu_total;
    }

    getMemoryTotal(node: any): string {
        let id = Object.getOwnPropertyNames(node)[0];
        return node[id].ram_total.toFixed(0);
    }

    getDiskTotal(node: any): string {
        let id = Object.getOwnPropertyNames(node)[0];
        return node[id].disk_total.toFixed(0);
    }

    getGpuTotal(node: any): string {
        let id = Object.getOwnPropertyNames(node)[0];
        return node[id].gpu_total;
    }
}
