import { defineConfig } from 'cypress';
// Populate process.env with values from .env file
require('dotenv').config();

export default defineConfig({
    viewportWidth: 1380,
    viewportHeight: 800,
    e2e: {
        experimentalStudio: true,
    },
    env: {
        auth0_username: process.env.AUTH0_USERNAME,
        auth0_password: process.env.AUTH0_PASSWORD,
        auth0_domain: process.env.REACT_APP_AUTH0_DOMAIN,
        auth0_audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        auth0_scope: process.env.REACT_APP_AUTH0_SCOPE,
        auth0_client_id: process.env.REACT_APP_AUTH0_CLIENTID,
        auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,
    },
});
