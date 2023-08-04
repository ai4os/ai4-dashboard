import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: 'https://aai-demo.egi.eu/auth/realms/egi',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin,

    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: 'ai4eosc-dashboard',

    // Authorization Code Flow
    responseType: 'code',

    // set the scope for the permissions the client should request
    // Important: Request offline_access to get a refresh token
    // The eduperson_entitlement scope is needed
    scope: 'openid profile offline_access eduperson_entitlement email',

    showDebugInformation: false,
};
