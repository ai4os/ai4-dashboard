export interface ModuleSummary {
    name: string;
    title: string;
    summary: string;
    keywords: string[];
}

export interface Module {
    title: string;
    summary: string;
    description: string;
    keywords: string[];
    license: string;
    date_creation: string;
    dataset_url: string;
    sources: {
        dockerfile_repo: string;
        docker_registry_repo: string;
        code: string;
    };
    continuous_integration: {
        build_status_badge: string;
        build_status_url: string;
    };
    tosca: object[];
}

export interface confObject {
    name: string;
    value: string | number;
    description: string;
    options?: string[];
}

export interface confObjectRange extends confObject {
    range: number[];
}

export interface confObjectStringArray extends confObject {
    values: string[];
}

export interface ModuleGeneralConfiguration {
    title: confObject;
    desc?: confObject;
    docker_image: confObject;
    docker_tag: confObject;
    service: confObject;
    jupyter_password?: confObject;
    hostname?: confObject;
    federated_secret?: confObject;
}

export interface ModuleHardwareConfiguration {
    cpu_num: confObjectRange;
    ram: confObjectRange;
    disk: confObjectRange;
    gpu_num: confObjectRange;
    gpu_type?: confObject;
    instances_num?: confObjectRange;
}

export interface ModuleStorageConfiguration {
    rclone_conf: confObject;
    rclone_url: confObject;
    rclone_vendor: confObject;
    rclone_user: confObject;
    rclone_password: confObject;
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

export interface KafkaServerToolConfiguration {
    general: ModuleGeneralConfiguration;
    hardware: ModuleHardwareConfiguration;
}

export interface TrainModuleRequest {
    general: {
        title: string;
        desc?: string;
        docker_image: string;
        docker_tag: string;
        service?: string;
        jupyter_password?: string;
        hostname?: string;
        federated_secret?: string;
    };
    hardware: {
        cpu_num: number;
        ram: number;
        disk: number;
        gpu_num?: number;
        gpu_type?: string;
        instance_num?: string;
    };
    storage?: {
        rclone_conf: string;
        rclone_url: string;
        rclone_vendor: string;
        rclone_user: string;
        rclone_password: string;
    };
    configuration?: {
        rounds: number;
        metric: string[];
        min_clients: number;
        strategy: string;
    };
}
