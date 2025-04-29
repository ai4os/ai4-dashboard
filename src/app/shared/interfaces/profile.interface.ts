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
}

export interface HuggingFaceTokenResponse {
    access_token: string;
    token_type?: string;
    expires_in?: number;
    scope?: string;
}
