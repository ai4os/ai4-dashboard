export interface ModuleSummary {
    moduleName: string;
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