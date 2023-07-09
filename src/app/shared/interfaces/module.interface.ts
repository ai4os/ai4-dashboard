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
        dockerfile_repo: string
        docker_registry_repo: string;
        code: string;
    }
    continuous_integration: {
        build_status_badge: string
        build_status_url: string
    }
    tosca: object[]

}

export interface ModuleConfiguration {
    general: [],
    hardware: [],
    storage: []
}

export interface TrainModuleRequest {
    general: {
        title: string,
        desc?: string,
        docker_image: string,
        docker_tag: string,
        service: string,
        jupyter_password?: string,
        hostname?: string
    },
    hardware: {
        cpu_num: number,
        ram: number,
        disk: number,
        gpu_num: number,
        gpu_type?: string,

    },
    storage: {
        rclone_conf: string,
        rclone_url: string,
        rclone_vendor: string,
        rclone_user: string,
        rclone_password: string
    }
}

// OSCAR MODELS

export interface Service {
    name: string,
    cluster_id: string,
    memory: string
    cpu: string,
    enable_gpu: boolean,
    total_mem: string
    synchronous: {
        min_scale: number,
        max_scale: number
    }
    replicas: Array<Replica>,
    rescheduler_threshold: number
    token: string,
    log_level: string,
    image: string,
    alpine: boolean,
    script: string,
    image_pull_secrets: Array<String>,
    environment: {
        Variables: {
            [key: string]: string;
        }
    },
    annotations: {
        [key: string]: string;
    },
    labels: {
        [key: string]: string;
    },
    input: Array<StorageIOConfig>,
    output: Array<StorageIOConfig>,
    storage_providers: StorageProviders,
    clusters: Clusters
}

interface Clusters {
    id: {
        endpoint: string,
        auth_user: string,
        auth_password: string,
        ssl_verify: boolean
    }
}

interface Replica {
    type: string,
    cluster_id: string,
    service_name: string,
    url: string,
    ssl_verify: boolean,
    priority: number,
    headers: {
        [key: string]: string;
    },
}

interface StorageIOConfig {
    storage_provider: string,
    path: string
    suffix: Array<String>,
    prefix: Array<String>
}

interface StorageProviders {
    s3: {
        id: {
            access_key: string,
            secret_key: string,
            region: string
        }
    },
    minio: {
        id: MiniIOProvider
    },
    onedata: {
        id: {
            oneprovider_host: string,
            token: string,
            space: string
        }
    },
    webdav: {
        id: {
            hostname: string,
            login: string,
            password: string
        }
    }
}

interface MiniIOProvider {
    endpoint: string,
    region: string,
    access_key: string,
    secret_key: string,
    verify: boolean
}

export interface JobInfo {
    status: string,
    creation_time: string,
    start_time: string,
    finish_time: string
}