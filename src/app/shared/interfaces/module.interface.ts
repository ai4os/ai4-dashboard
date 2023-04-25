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
        jupyter_password?: string
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