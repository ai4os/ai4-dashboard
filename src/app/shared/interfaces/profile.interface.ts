export interface RequestLoginResponse {
    poll: {
        token: string;
        endpoint: string;
    };
    login: string;
}

export interface CompleteLoginResponse {
    server: string;
    loginName: string;
    appPassword: string;
}

export interface StorageCredential {
    vendor: string;
    server: string;
    loginName: string;
    appPassword: string;
    conf?: string;
}

export interface HuggingFaceTokenResponse {
    access_token: string;
    token_type?: string;
    expires_in?: number;
    scope?: string;
}

export interface VoInfo {
    name: string;
    roles: string[];
}

export interface MLflowCredentials {
    username: string;
    password: {
        value: string;
        hide: boolean;
    };
}

export interface LiteLLMKeyResponse {
    id: string;
    created_at: string;
}

export interface LiteLLMKey {
    id: string;
    createdAt: string;
}

export interface KeyTableColumn {
    columnDef: string;
    header: string;
}

export interface KeyTableRow {
    id: string;
    creationTime: string;
}
