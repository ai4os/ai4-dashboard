export interface KeycloakToken {
    name: string;
    sub: string;
    email: string;
    eduperson_entitlement?: string[] | string;
}
