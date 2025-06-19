import { defineConfig } from 'cypress';
// Populate process.env with values from .env file
require('dotenv').config();

export default defineConfig({
    viewportWidth: 1380,
    viewportHeight: 800,
    chromeWebSecurity: false,
    e2e: {
        testIsolation: false,
        experimentalModifyObstructiveThirdPartyCode: true,
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('before:browser:launch', (browser, launchOptions) => {
                console.log(launchOptions.args);
                let removeFlags = ['--enable-automation'];
                launchOptions.args = launchOptions.args.filter(
                    (value) => !removeFlags.includes(value)
                );
                return launchOptions;
            });
        },
    },
    video: true,
});
