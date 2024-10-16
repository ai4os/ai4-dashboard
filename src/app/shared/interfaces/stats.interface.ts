export interface UserStats {
    'full-agg': {
        cpu_num: number;
        cpu_MHz: number;
        memory_MB: number;
        disk_MB: number;
        gpu_num: number;
    };
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
    'users-agg': {
        owner: string;
        cpu_num: number;
        cpu_MHz: number;
        memory_MB: number;
        disk_MB: number;
        gpu_num: number;
    };
}

export interface ClusterStats {
    cluster: {
        cpu_total: number;
        cpu_used: number;
        disk_total: number;
        disk_used: number;
        gpu_total: number;
        gpu_used: number;
        gpu_models: GpuStats[];
        ram_total: number;
        ram_used: number;
    };
    datacenters: DatacenterStats[];
}

export interface DatacenterStats {
    name: string;
    lat: number;
    lon: number;
    PUE: number;
    energy_quality: number;
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
