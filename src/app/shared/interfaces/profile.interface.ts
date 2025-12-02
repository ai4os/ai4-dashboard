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

export interface APIsixKeyResponse {
    id: string;
    api_key: string;
}

export interface APIsixKey {
    id: string;
    key: {
        value: string;
        hide: boolean;
    };
}
