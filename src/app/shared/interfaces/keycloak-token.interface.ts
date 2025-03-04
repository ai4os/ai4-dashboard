export interface KeycloakToken {
    name: string;
    email: string;
    realm_access: {
        roles: string[];
    };
}
