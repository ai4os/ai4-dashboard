import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats-service/stats-service.service';
import { UserStats } from '@app/shared/interfaces/stats.interface';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    constructor(private statsService: StatsService) {}

    protected userStats: string[] = [];
    protected totalStats: string[] = [];

    // User agrregate variables
    protected cpuNumUserAgg = 0;
    protected cpuMHzUserAgg = 0;
    protected memoryMBUserAgg = 0;
    protected diskMBUserAgg = 0;
    protected gpunumUserAgg = 0;

    // Namespace aggregate variables
    protected cpuNumNamespaceAgg = 0;
    protected cpuMHzNamespaceAgg = 0;
    protected memoryMBNamespaceAgg = 0;
    protected diskMBNamespaceAgg = 0;
    protected gpunumNamespaceAgg = 0;

    // Time series variables
    protected dates: string[] = [];
    protected cpuMhzData: number[] = [];
    protected cpuNumData: number[] = [];
    protected memoryMBData: number[] = [];
    protected diskMBData: number[] = [];
    protected gpuNumData: number[] = [];
    protected queuedData: number[] = [];
    protected runningData: number[] = [];

    ngOnInit(): void {
        this.statsService
            .getUserStats()
            .subscribe((statsResponse: UserStats) => {
                // User aggregate
                if (statsResponse['users-agg']) {
                    this.cpuNumUserAgg = statsResponse['users-agg'].cpu_num;
                    this.cpuMHzUserAgg = statsResponse['users-agg'].cpu_MHz;
                    this.memoryMBUserAgg = statsResponse['users-agg'].memory_MB;
                    this.diskMBUserAgg = statsResponse['users-agg'].disk_MB;
                    this.gpunumUserAgg = statsResponse['users-agg'].gpu_num;
                }

                // Namespace aggregate variables
                if (statsResponse['full-agg']) {
                    this.cpuNumNamespaceAgg = statsResponse['full-agg'].cpu_num;
                    this.cpuMHzNamespaceAgg = statsResponse['full-agg'].cpu_MHz;
                    this.memoryMBNamespaceAgg =
                        statsResponse['full-agg'].memory_MB;
                    this.diskMBNamespaceAgg =
                        statsResponse['full-agg'].memory_MB;
                    this.gpunumNamespaceAgg =
                        statsResponse['full-agg'].memory_MB;
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

                // UserStats
                this.userStats = [
                    this.cpuNumUserAgg.toString(),
                    this.cpuMHzUserAgg.toString(),
                    this.memoryMBUserAgg.toString(),
                    this.diskMBUserAgg.toString(),
                    this.gpunumUserAgg.toString(),
                ];

                // TotalStats
                this.totalStats = [
                    this.cpuNumNamespaceAgg.toString(),
                    this.cpuMHzNamespaceAgg.toString(),
                    this.memoryMBNamespaceAgg.toString(),
                    this.diskMBNamespaceAgg.toString(),
                    this.gpunumNamespaceAgg.toString(),
                ];
            });
    }
}
