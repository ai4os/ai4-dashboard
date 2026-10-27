export type SeriesPoint = [string, number];

export interface EnergySeriesPoint {
    ts: string;
    power_w: number;
    energy_wh: number;
    carbon_g: number;
    water_l: number;
    live: boolean;
}

export interface EnergyStats {
    energy_wh: number;
    carbon_g: number;
    water_l: number;
    tue_factor: number;
    power_w: number | null;
    since: string;
    as_of: string;
    live_as_of: string | null;
    complete: boolean;
    degraded: boolean;
    coverage_ratio: number | null;
    datacenters: string[] | null;
    deployments: number | null;
    series: EnergySeriesPoint[] | null;
}

export interface DatacenterApi {
    lat: number;
    lon: number;
    PUE: number;
    nodes: Record<string, NodeStats>;
    footprints: {
        carbon: SeriesPoint[];
        water: SeriesPoint[];
        'environmental-score': SeriesPoint[];
    };
    energy: EnergyStats | null;
    country?: DatacenterStats['country'];
    affinity?: DatacenterStats['affinity'];
}

export interface ClusterTotalsApi {
    jobs_num: number;
    reallocations: number;
    cpu_total: number;
    cpu_used: number;
    gpu_total: number;
    gpu_used: number;
    ram_total: number;
    ram_used: number;
    disk_total: number;
    disk_used: number;
    gpu_models: Record<string, GpuStats>;
}

export interface ClusterStats {
    datacenters: Record<string, DatacenterApi>;
    cluster: ClusterTotalsApi;
    updated_at: string;
}

export interface UserAggregateApi {
    owner?: string;
    cpu_num: number;
    cpu_MHz: number;
    memory_MB: number;
    disk_MB: number;
    gpu_num: number;
}

export interface UserStats {
    'full-agg': UserAggregateApi;
    'users-agg': UserAggregateApi;
    timeseries: {
        date: string[];
        cpu_num: number[];
        cpu_MHz: number[];
        memory_MB: number[];
        disk_MB: number[];
        gpu_num: number[];
        queued: number[];
        running: number[];
    };
    energy: EnergyStats | null;
}

export interface DatacenterStats {
    name: string;
    lat: number;
    lon: number;
    PUE: number;
    affinity: number;
    country: string;
    energy_quality: number;
    energy_water_usage: number;
    green_score: number;
    footprints: {
        carbon: any[];
        water: any[];
        'environmental-score': any[];
    };
    nodes: NodeStats[];
}

export interface NodeStats {
    name: string;
    cpu_total: number;
    cpu_used: number;
    disk_total: number;
    disk_used: number;
    gpu_total: number;
    gpu_used: number;
    ram_total: number;
    ram_used: number;
    jobs_num: number;
    gpu_models: GpuStats[];
    status: string;
}

export interface GpuStats {
    gpu_total: number;
    gpu_used: number;
}

export interface GlobalStats {
    cpuNumAgg: number;
    cpuNumTotal: number;
    cpuMHzAgg?: number;
    cpuMHzTotal?: number;
    memoryMBAgg: number;
    memoryMBTotal: number;
    diskMBAgg: number;
    diskMBTotal: number;
    gpuNumAgg: number;
    gpuNumTotal: number;
}
