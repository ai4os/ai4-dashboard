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

export interface ConfObject {
    name: string;
    value: string | number | boolean | Date;
    description: string;
    options?: string[];
}

export interface ConfObjectRange extends ConfObject {
    range: number[];
}

export interface ConfObjectStringArray extends ConfObject {
    values: string[];
}

export interface ConfObjectStringBoolean {
    name: string;
    value: { stringValue: string; booleanValue: boolean };
    description: string;
    options?: string[];
}

export interface ConfObjectBoolean {
    name: string;
    value: boolean;
    description: string;
}

export interface ModuleGeneralConfiguration {
    title: ConfObject;
    desc?: ConfObject;
    co2?: ConfObject;
    docker_image: ConfObject;
    docker_tag: ConfObject;
    service: ConfObject;
    jupyter_password?: ConfObject;
    // CVAT
    cvat_username?: ConfObject;
    cvat_password?: ConfObject;
    // AI4LIFE
    model_id?: ConfObject;
    // LLM
    llm?: LlmConfiguration;
}

export interface ModuleHardwareConfiguration {
    cpu_num: ConfObjectRange;
    ram: ConfObjectRange;
    disk: ConfObjectRange;
    gpu_num: ConfObjectRange;
    gpu_type?: ConfObject;
    warning?: string;
}

export interface ModuleStorageConfiguration {
    rclone_conf: ConfObject;
    rclone_url: ConfObject;
    rclone_vendor: ConfObject;
    rclone_user: ConfObject;
    rclone_password: ConfObject;
    datasets: ConfObjectStringBoolean;
}

export interface FederatedServerConfiguration {
    rounds: ConfObjectRange;
    metric: ConfObject;
    min_fit_clients: ConfObjectRange;
    min_available_clients: ConfObjectRange;
    strategy: ConfObject;
    mu: ConfObjectRange;
    fl: ConfObjectRange;
    momentum: ConfObjectRange;
    dp: ConfObjectBoolean;
    mp: ConfObject;
    noise_mult: ConfObjectRange;
    sampled_clients: ConfObjectRange;
    clip_norm: ConfObjectRange;
}

export interface LlmConfiguration {
    type: ConfObject;
    vllm_model_id: ConfObjectRange;
    ui_username: ConfObject;
    ui_password: ConfObject;
    HF_token: ConfObject;
    openai_api_key: ConfObject;
    openai_api_url: ConfObject;
}

export interface NvflareConfiguration {
    username: ConfObject;
    password: ConfObject;
    app_location: ConfObject;
    public_project: ConfObjectRange;
    starting_date: ConfObject;
    end_date: ConfObject;
}

export interface Ai4lifeConfiguration {
    model_id: ConfObject;
}

export interface CvatConfiguration {
    username: ConfObject;
    password: ConfObject;
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
    ai4life: Ai4lifeConfiguration;
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
    id: string;
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
