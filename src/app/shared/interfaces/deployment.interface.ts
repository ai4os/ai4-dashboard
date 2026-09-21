export interface EnergySeries {
    ts: string;
    power_w: number;
    energy_wh: number;
    carbon_g: number;
    water_l: number;
    live: boolean;
}

export interface EnergyAccumulated {
    energy_wh: number;
    tue_factor: number;
    carbon_g: number;
    water_l: number;
    power_w: number;
    since: string;
    as_of: string;
    live_as_of: string;
    complete: boolean;
    coverage_ratio: number;
    degraded: boolean;
    datacenters: string[];
}

export interface DeploymentEnergy {
    deployment_uuid: string;
    start: string;
    end: string;
    source: string;
    series: EnergySeries[];
    accumulated: EnergyAccumulated;
}

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
    endpoints?: Record<string, string>;
    active_endpoints?: string[];
    main_endpoint: string;
    alloc_ID?: string;
    error_msg?: string;
    tool_name?: string;
    templates?: {
        'local/batch.sh': string;
    };
    energy?: DeploymentEnergy | null;
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

export interface DeploymentRowEnergy {
    power_w: number;
    energy_wh: number;
    carbon_g: number;
    water_l: number;
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
    endpoints?: Record<string, string> | undefined;
    mainEndpoint?: string;
    error_msg?: string;
    description?: string;
    snapshot_ID?: string;
    datacenter?: string;
    energy?: DeploymentRowEnergy | null;
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
