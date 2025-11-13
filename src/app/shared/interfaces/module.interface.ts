export interface ModuleSummary {
    [x: string]: any;
    id: string;
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

export interface Ai4eoscModule {
    id: string;
    title: string;
    summary: string;
    description: string;
    license: string;
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

export interface Ai4lifeModule {
    id: string;
    name: string;
    description: string;
    doi: string;
    created: string;
    covers: string[];
    downloadCount: string;
    tags: string[];
    license: string;
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
    value: string | number | boolean | Date;
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
    co2?: confObject;
    docker_image: confObject;
    docker_tag: confObject;
    service: confObject;
    jupyter_password?: confObject;
    // CVAT
    cvat_username?: confObject;
    cvat_password?: confObject;
    // AI4LIFE
    model_id?: confObject;
    // LLM
    llm?: LlmConfiguration;
}

export interface ModuleHardwareConfiguration {
    cpu_num: confObjectRange;
    ram: confObjectRange;
    disk: confObjectRange;
    gpu_num: confObjectRange;
    gpu_type?: confObject;
    warning?: string;
}

export interface ModuleStorageConfiguration {
    datasets: confObjectStringBoolean;
}

export interface FederatedServerConfiguration {
    rounds: confObjectRange;
    metric: confObjectStringArray;
    min_clients: confObjectRange;
    strategy: confObject;
}

export interface LlmConfiguration {
    type: confObject;
    vllm_model_id: confObjectRange;
    ui_username: confObject;
    ui_password: confObject;
    HF_token: confObject;
    openai_api_key: confObject;
    openai_api_url: confObject;
}

export interface NvflareConfiguration {
    username: confObject;
    password: confObject;
    app_location: confObject;
    public_project: confObjectRange;
    starting_date: confObject;
    end_date: confObject;
}

export interface ModuleConfiguration {
    general: ModuleGeneralConfiguration;
    hardware: ModuleHardwareConfiguration;
    storage: ModuleStorageConfiguration;
}

export interface FederatedServerToolConfiguration {
    general: ModuleGeneralConfiguration;
    hardware: ModuleHardwareConfiguration;
    flower: FederatedServerConfiguration;
}

export interface CvatToolConfiguration {
    general: ModuleGeneralConfiguration;
    storage: ModuleStorageConfiguration;
}

export interface LlmToolConfiguration {
    general: ModuleGeneralConfiguration;
    llm: LlmConfiguration;
}

export interface Ai4LifeLoaderToolConfiguration {
    general: ModuleGeneralConfiguration;
    hardware: ModuleHardwareConfiguration;
}

export interface NvflareToolConfiguration {
    general: ModuleGeneralConfiguration;
    hardware: ModuleHardwareConfiguration;
    nvflare: NvflareConfiguration;
}

export interface TrainModuleRequest {
    general: {
        title: string;
        desc?: string;
        co2?: boolean;
        docker_image: string;
        docker_tag: string;
        service?: string;
        jupyter_password?: string;
        // cvat
        cvat_username?: string;
        cvat_password?: string;
        // ai4life
        model_id?: string;
    };
    hardware?: {
        cpu_num: number;
        ram: number;
        disk?: number;
        gpu_num?: number;
        gpu_type?: string;
    };
    storage?: {
        rclone_conf: string;
        rclone_url: string;
        rclone_vendor: string;
        rclone_user: string;
        rclone_password: string;
        cvat_backup?: string;
        datasets?: Dataset[];
    };
    flower?: {
        rounds: number;
        metric: string[];
        min_fit_clients: number;
        min_available_clients: number;
        strategy: string;
        mu: number;
        fl: number;
        momentum: number;
        dp: boolean;
        mp: boolean;
        noise_mult: number;
        sampled_clients: number;
        clip_norm: number;
    };
    llm?: {
        type: string;
        vllm_model_id: string;
        ui_username: string;
        ui_password: string;
        HF_token: string;
        openai_api_key: string;
        openai_api_url: string;
    };
    nvflare?: {
        username: string;
        password: string;
        app_location: string;
        public_project: boolean;
        starting_date: string;
        end_date: string;
    };
}

export interface Dataset {
    doi: string;
    force_pull: boolean;
}

export interface Secret {
    token?: string;
    username?: string;
    password?: string;
}

export interface VllmModelConfig {
    name: string;
    description: string;
    family: string;
    license: string;
    context: string;
    needs_HF_token: boolean;
    args: string[];
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

export interface File {
    Path: string;
    Name: string;
    Size: number;
    MimeType: string;
    ModTime: string;
    IsDir: boolean;
}
