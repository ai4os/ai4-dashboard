/// <reference types="cypress" />

Cypress.Commands.add('login', (username: string, password: string) => {
    const log = Cypress.log({
        displayName: 'AUTH0 LOGIN',
        message: [`🔐 Authenticating | ${username}`],
        // @ts-ignore
        autoEnd: false,
    });

    log.snapshot('before');
    const args = { username, password };

    cy.session(
        `auth-${username}`,
        () => {
            cy.visit('http://localhost:8080/');

            cy.contains('Login', { timeout: 20000 }).click({ force: true });

            cy.origin(
                'https://login.cloud.ai4eosc.eu/',
                { args },
                ({ username, password }) => {
                    Cypress.on('uncaught:exception', () => {
                        return false;
                    });

                    cy.get('input#username').type(username);
                    cy.get('input#password').type(password).type('{enter}');
                }
            );

            cy.url().should('equal', 'http://localhost:8080/catalog/modules');
        },
        {
            validate() {
                cy.contains(`TestAI4EOSC Cypress`);
            },
            cacheAcrossSpecs: true,
        }
    );

    log.snapshot('after');
});

Cypress.Commands.add('initializeTrainModuleForm', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('Dogs breed detector', { timeout: 20000 }).click({
        force: true,
    });
    cy.get('.action-button').contains('Deploy', { timeout: 10000 }).click();
    cy.contains('Inference API + UI (dedicated)', { timeout: 10000 }).click();
    cy.get('#deployment-title', { timeout: 10000 }).type('test');
    cy.wait(500);
    cy.contains('Next', { timeout: 10000 })
        .scrollIntoView()
        .click({ force: true });
    cy.wait(500);
    cy.contains('Next', { timeout: 10000 })
        .scrollIntoView()
        .click({ force: true });
});
