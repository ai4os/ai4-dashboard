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
