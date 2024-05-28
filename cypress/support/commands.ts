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
