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
            cy.contains('Login', { timeout: 20000 }).click();

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
    cy.contains('Dogs breed detector', { timeout: 20000 }).click();
    cy.contains('Decline').click();
    cy.get('.action-button').contains('Deploy', { timeout: 10000 }).click();
    cy.contains('Inference API (dedicated)', { timeout: 10000 }).click();
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
