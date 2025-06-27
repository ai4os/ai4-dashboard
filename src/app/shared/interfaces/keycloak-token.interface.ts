export interface KeycloakToken {
    name: string;
    email: string;
    sub: string;
    realm_access: {
        roles: string[];
    };
}
