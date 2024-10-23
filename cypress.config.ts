import { defineConfig } from 'cypress';
// Populate process.env with values from .env file
require('dotenv').config();

export default defineConfig({
    viewportWidth: 1380,
    viewportHeight: 800,
    chromeWebSecurity: false,
    e2e: {
        testIsolation: false,
    },
});
