export interface OscarService {
    environment: { Variables: { PAPI_CREATED: string; PAPI_TITLE: string } };
    name: string;
    title: string;
    owner: string;
    memory: string;
    cpu: string;
    total_memory: string;
    total_cpu: string;
    image: string;
    token: string;
    endpoint: string;
    submit_time: string;
    storage_providers: { minio: { default: OscarStorageProvider } };
}

export interface OscarStorageProvider {
    access_key: string;
    endpoint: string;
    region: string;
    secret_key: string;
    verify: boolean;
}

export interface OscarServiceRequest {
    allowed_users: [];
    cpu: number;
    image: string;
    memory: number;
    title: string;
}
