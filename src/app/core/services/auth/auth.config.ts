import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: 'https://login.cloud.ai4eosc.eu/realms/ai4eosc',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin,

    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: 'test-client',

    dummyClientSecret: '',

    dummyClientSecret: '',

    // Authorization Code Flow
    responseType: 'code',

    // set the scope for the permissions the client should request
    // Important: Request offline_access to get a refresh token
    scope: 'openid profile offline_access email',

    showDebugInformation: false,
};
