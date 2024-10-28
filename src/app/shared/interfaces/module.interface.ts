export interface ModuleSummary {
    [x: string]: any;
    name: string;
    title: string;
    summary: string;
    categories: string[];
    tags: string[];
    libraries: string[];
    tasks: string[];
    dates?: Dates;
    'data-type'?: string[];
}

export interface Module {
    title: string;
    summary: string;
    description: string;
    doi?: string;
    links: {
        source_code: string;
        documentation?: string;
        docker_image?: string;
        zenodo_doi?: string;
        dataset?: string;
        weights?: string;
        citation?: string;
        base_model?: string;
        cicd_badge?: string;
        cicd_url?: string;
    };
    dates?: Dates;
    libraries: string[];
    tasks: string[];
    categories: string[];
    tags: string[];
    'data-type'?: string[];
}

export interface Dates {
    created: string;
    updated: string;
}

export interface FilterGroup {
    libraries: string[];
    tasks: string[];
    categories: string[];
    datatypes: string[];
    tags: string[];
}

export interface confObject {
    name: string;
    value: string | number | boolean;
    description: string;
    options?: string[];
}

export interface confObjectRange extends confObject {
    range: number[];
}

export interface confObjectStringArray extends confObject {
    values: string[];
}

export interface confObjectStringBoolean {
    name: string;
    value: { stringValue: string; booleanValue: boolean };
    description: string;
    options?: string[];
}

export interface ModuleGeneralConfiguration {
    title: confObject;
    desc?: confObject;
    docker_image: confObject;
    docker_tag: confObject;
    service: confObject;
    jupyter_password?: confObject;
    hostname?: confObject;
}

export interface ModuleHardwareConfiguration {
    cpu_num: confObjectRange;
    ram: confObjectRange;
    disk: confObjectRange;
    gpu_num: confObjectRange;
    gpu_type?: confObject;
}

export interface ModuleStorageConfiguration {
    rclone_conf: confObject;
    rclone_url: confObject;
    rclone_vendor: confObject;
    rclone_user: confObject;
    rclone_password: confObject;
    datasets: confObjectStringBoolean;
}

export interface FederatedServerConfiguration {
    rounds: confObjectRange;
    metric: confObjectStringArray;
    min_clients: confObjectRange;
    strategy: confObject;
}

export interface ModuleConfiguration {
    general: ModuleGeneralConfiguration;
    hardware: ModuleHardwareConfiguration;
    storage: ModuleStorageConfiguration;
}

export interface FederatedServerToolConfiguration {
    general: ModuleGeneralConfiguration;
    hardware: ModuleHardwareConfiguration;
    configuration: FederatedServerConfiguration;
}

export interface TrainModuleRequest {
    general: {
        title: string;
        desc?: string;
        docker_image: string;
        docker_tag: string;
        service: string;
        jupyter_password?: string;
        hostname?: string;
    };
    hardware: {
        cpu_num: number;
        ram: number;
        disk: number;
        gpu_num: number;
        gpu_type?: string;
    };
    storage?: {
        rclone_conf: string;
        rclone_url: string;
        rclone_vendor: string;
        rclone_user: string;
        rclone_password: string;
        datasets: Dataset[];
    };
    configuration?: {
        rounds: number;
        metric: string[];
        min_fit_clients: number;
        min_available_clients: number;
        strategy: string;
        mu: number;
        fl: number;
        momentum: number;
        dp: boolean;
        noise_mult: number;
        sampled_clients: number;
        clip_norm: number;
    };
}

export interface Dataset {
    doi: string;
    force_pull: boolean;
}

export interface Secret {
    token: string;
}

export interface GradioCreateResponse {
    status: string;
    job_ID: string;
}

export interface GradioDeployment {
    job_ID: string;
    name: string;
    status: string;
    owner: string;
    title: string;
    description: string;
    docker_image: string;
    docker_command: string;
    submit_time: string;
    resources: {
        cpu_num: number;
        cpu_MHz: number;
        gpu_num: number;
        memory_MB: number;
        disk_MB: number;
    };
    endpoints: {
        ui: string;
    };
    active_endpoints: string[];
    main_endpoint: string;
    alloc_ID: string;
    datacenter: string;
}
