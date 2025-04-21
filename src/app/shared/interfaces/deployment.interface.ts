export interface Deployment {
    job_ID: string;
    status: string;
    owner: string;
    title: string;
    datacenter: string;
    description?: string;
    docker_image: string;
    docker_command?: string;
    submit_time: string;
    resources?: {
        cpu_MHz: number;
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
    tool_name?: string;
}

export interface StatusReturn {
    status: string;
    error_msg?: string;
    job_ID?: string;
}

export interface TableColumn {
    columnDef: string;
    header: string;
    hidden?: boolean;
}

export interface DeploymentTableRow {
    uuid: string;
    name: string;
    status?: string;
    containerName: string;
    tagName?: string;
    creationTime: string;
    gpus?: string | number;
    size?: string;
    endpoints?: { [index: string]: string } | undefined;
    mainEndpoint?: string;
    error_msg?: string;
    description?: string;
    snapshot_ID?: string;
    datacenter?: string;
}

export interface Snapshot {
    snapshot_ID: string;
    title: string;
    status: string;
    submit_time: string;
    docker_image: string;
    size: number;
    nomad_ID: string;
    error_msg?: string;
    description?: string;
}
