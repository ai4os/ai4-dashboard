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
        ram_total: number;
        ram_used: number;
    };
    nodes: NodeStats[];
}

export interface NodeStats {
    cpu_total: number;
    cpu_used: number;
    disk_total: number;
    disk_used: number;
    gpu_total: number;
    gpu_used: number;
    ram_total: number;
    ram_used: number;
}
