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
            cy.contains('Login').click();

            cy.origin('https://aai.egi.eu', () => {
                cy.get('.ssp-btn.bitbucket').click();
            });

            cy.origin(
                'https://id.atlassian.com/l',
                { args },
                ({ username, password }) => {
                    cy.get('#username').type(username, {
                        log: false,
                    });

                    cy.get('#login-submit').click();

                    cy.get('#password').type(password, {
                        log: false,
                    });

                    cy.get('#login-submit').click();
                }
            );

            cy.url().should('equal', 'http://localhost:8080/');
        },
        {
            validate() {
                cy.contains(`Test AI4EOSC`);
            },
            cacheAcrossSpecs: true,
        }
    );

    log.snapshot('after');
});

Cypress.Commands.add('initializeTrainModuleForm', () => {
    cy.visit('http://localhost:8080/');
    cy.contains('Dogs breed detector', { timeout: 10000 }).click();
    cy.contains('Decline').click();
    cy.contains('Train', { timeout: 10000 }).click();
    cy.contains('Nomad', { timeout: 10000 }).click();
    cy.get('#deployment-title', { timeout: 10000 }).type('test');
    cy.wait(500);
    cy.contains('Next', { timeout: 10000 }).click();
    cy.wait(500);
    cy.contains('Next', { timeout: 10000 }).click({ force: true });
});

Cypress.Commands.add('deleteDeployment', () => {
    cy.get(
        '.mat-mdc-card-content > .table-container > .mat-mdc-table > .mdc-data-table__content > .mat-mdc-row > .cdk-column-actions > .actions-container > [mattooltip="Delete"] > .mat-mdc-button-touch-target'
    ).click();
    cy.get('#yesBtn').click();
});
