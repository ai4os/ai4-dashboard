/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        login(username: string, password: string): Chainable<void>;
        initializeTrainModuleForm(deploymentTitle?: string): Chainable<void>;
        addNextcloudStorageCredentials(): Chainable<void>;
        deleteNextcloudStorageCredentials(): Chainable<void>;
        closeAccessLevelPopup(): Chainable<void>;
    }
}
