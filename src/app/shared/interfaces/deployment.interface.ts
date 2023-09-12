export interface Deployment {
    job_ID: string;
    status: string;
    owner: string;
    title: string;
    description?: string;
    docker_image: string;
    docker_command?: string;
    submit_time: string;
    resources?: {
        cpu_num: number;
        gpu_num: number;
        memory_MB: number;
        disk_MB: number;
    };
    endpoints?: { [index: string]: string };
    active_endpoints?: [string];
    main_endpoint: string;
    alloc_ID?: string;
    error_msg?: string;
}

export interface statusReturn {
    status: string;
    error_msg?: string;
    job_ID?: string;
}
