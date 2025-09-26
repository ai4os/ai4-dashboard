import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats/stats.service';
import {
    GlobalStats,
    ClusterStats,
    GpuStats,
    NodeStats,
    UserStats,
    DatacenterStats,
} from '@app/shared/interfaces/stats.interface';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    constructor(
        private statsService: StatsService,
        private readonly authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.authService.userProfile$.subscribe((profile) => {
            if (profile) {
                this.userProfile = profile;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    userProfile?: UserProfile;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    panelOpenState = false;
    userStatsLoading = false;
    clusterStatsLoading = false;
    userDataAvailable = false;
    clusterDataAvailable = false;

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

    // Datacenters
    protected datacentersStats: DatacenterStats[] = [];

    ngOnInit(): void {
        this.userStatsLoading = true;
        this.clusterStatsLoading = true;

        this.statsService.getUserStats().subscribe({
            next: (statsResponse: UserStats) => {
                if (statsResponse == null) {
                    this.userDataAvailable = false;
                    this.userStatsLoading = false;
                } else {
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
                        this.userGlobalStats.gpuNumAgg = this.gpuNumUserAgg;
                    }

                    // Namespace aggregate variables
                    if (statsResponse['full-agg']) {
                        this.cpuNumNamespaceAgg =
                            statsResponse['full-agg'].cpu_num;
                        this.cpuMHzNamespaceAgg = Math.trunc(
                            statsResponse['full-agg'].cpu_MHz
                        );
                        this.memoryMBNamespaceAgg = Math.trunc(
                            statsResponse['full-agg'].memory_MB
                        );
                        this.diskMBNamespaceAgg =
                            statsResponse['full-agg'].disk_MB;
                        this.gpuNumNamespaceAgg =
                            statsResponse['full-agg'].gpu_num;

                        this.userGlobalStats.cpuNumTotal =
                            this.cpuNumNamespaceAgg;
                        this.userGlobalStats.cpuMHzTotal =
                            this.cpuMHzNamespaceAgg;
                        this.userGlobalStats.memoryMBTotal =
                            this.memoryMBNamespaceAgg;
                        this.userGlobalStats.diskMBTotal =
                            this.diskMBNamespaceAgg;
                        this.userGlobalStats.gpuNumTotal =
                            this.gpuNumNamespaceAgg;
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

                    this.userDataAvailable = true;
                    this.userStatsLoading = false;
                }
            },
            error: () => {
                this.userDataAvailable = false;
                this.userStatsLoading = false;
            },
        });

        this.statsService.getClusterStats().subscribe({
            next: (statsResponse: ClusterStats) => {
                if (statsResponse == null) {
                    this.clusterDataAvailable = false;
                    this.clusterStatsLoading = false;
                } else {
                    // Cluster
                    if (statsResponse['cluster']) {
                        // Aggregate
                        this.cpuNumClusterAgg =
                            statsResponse['cluster'].cpu_used;
                        this.memoryMBClusterAgg = Math.trunc(
                            statsResponse['cluster'].ram_used
                        );
                        this.diskMBClusterAgg = Math.trunc(
                            statsResponse['cluster'].disk_used
                        );
                        this.gpuNumClusterAgg =
                            statsResponse['cluster'].gpu_used;
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
                    for (const dc in statsResponse['datacenters']) {
                        for (const node in statsResponse['datacenters'][dc][
                            'nodes'
                        ]) {
                            if (
                                statsResponse['datacenters'][dc]['nodes'][node]
                                    .gpu_total > 0
                            ) {
                                this.nodesGpu.push(
                                    statsResponse['datacenters'][dc]['nodes'][
                                        node
                                    ]
                                );
                            } else {
                                this.nodesCpu.push(
                                    statsResponse['datacenters'][dc]['nodes'][
                                        node
                                    ]
                                );
                            }
                        }
                    }

                    // Datacenters
                    for (const dc in statsResponse['datacenters']) {
                        const datacenter: DatacenterStats = {
                            name: dc,
                            lat: statsResponse['datacenters'][dc]['lat'],
                            lon: statsResponse['datacenters'][dc]['lon'],
                            PUE: statsResponse['datacenters'][dc]['PUE'],
                            energy_quality:
                                statsResponse['datacenters'][dc][
                                    'energy_quality'
                                ],
                            nodes: statsResponse['datacenters'][dc]['nodes'],
                        };
                        this.datacentersStats.push(datacenter);
                    }

                    this.clusterDataAvailable = true;
                    this.clusterStatsLoading = false;
                }
            },
            error: () => {
                this.clusterDataAvailable = false;
                this.clusterStatsLoading = false;
            },
        });
    }
}
