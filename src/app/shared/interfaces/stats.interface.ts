export interface statsResponse {
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
