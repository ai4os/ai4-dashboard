describe('deployments section', function () {
    before(function () {
        cy.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));

        // create tool
        cy.contains('Federated learning server', { timeout: 20000 }).click();
        cy.contains('Decline').click();
        cy.get('#deploy-tool-button', { timeout: 10000 }).click();
        cy.get('#deployment-title', { timeout: 10000 }).type('fl-test');
        cy.contains('Quick submit').click();
    });

    it('shows deployments section', function () {
        cy.contains('Deployments', { timeout: 20000 }).should('be.visible');
        cy.contains('Modules', { timeout: 50000 }).should('be.visible');
        cy.contains('Tools').should('be.visible');
        cy.contains('Deployment created with ID').should('be.visible');
        cy.contains('fl-test', { timeout: 20000 }).should('be.visible');
        cy.contains('ai4oshub/ai4os-federated-server:latest').should(
            'be.visible'
        );
    });

    it('shows secrets management dialog', function () {
        cy.get('#secrets-button').click();
        cy.get('#card-title').contains('Manage secrets').should('be.visible');
        cy.get('.tool-title').contains('fl-test').should('be.visible');
        cy.contains('List of secrets').should('be.visible');
        cy.contains('default').should('be.visible');
        cy.get('#add-button').contains('Add').should('be.visible');
        cy.contains('Close').should('be.visible');
    });

    it('show and copy buttons', function () {
        cy.get('#secret')
            .should('have.prop', 'nodeName', 'INPUT')
            .and('have.attr', 'type', 'password');
        cy.get('#show-button').click();
        cy.get('#secret')
            .should('have.prop', 'nodeName', 'INPUT')
            .and('have.attr', 'type', 'text');

        cy.get('#copy-button').click();
        cy.contains('Copied to clipboard!').should('be.visible');
    });

    it('create secret', function () {
        cy.get('#input').type('client1');
        cy.get('#add-button').click();
        cy.contains('Successfully created secret with name: client1', {
            timeout: 20000,
        }).should('be.visible');
        cy.contains('client1', { timeout: 20000 }).should('be.visible');
    });

    it('create duplicated secret', function () {
        cy.get('#input').type('client1');
        cy.contains('Secret names must be unique').should('be.visible');
        cy.get('#add-button').should('be.disabled');
        cy.contains('client1', { timeout: 10000 }).should('be.visible');
        cy.get('#input').clear();
    });

    it('create whitespaces secret', function () {
        cy.get('#input').type('    ');
        cy.get(
            '.new-secret-item > .mat-mdc-form-field > .mat-mdc-form-field-subscript-wrapper'
        ).click();
        cy.contains('Secret names cannot be whitespaces').should('be.visible');
        cy.get('#add-button').should('be.disabled');
        cy.get('#input').clear();
    });

    it('delete secret', function () {
        cy.get('#delete-button').click();
        cy.contains('Confirm your action').should('be.visible');
        cy.contains('Are you sure you want to delete this secret?').should(
            'be.visible'
        );
        cy.get('#yesBtn').click();
        cy.contains('client1', { timeout: 10000 }).should('not.be.visible');
    });

    it('delete last secret', function () {
        cy.get('#delete-button', { timeout: 25000 }).click();
        cy.contains('Confirm your action', { timeout: 25000 }).should(
            'be.visible'
        );
        cy.contains(
            'Are you sure you want to delete this secret? Be careful! Some tools need at least one secret to work'
        ).should('be.visible');
        cy.get('#noBtn').click();
        cy.contains('default', { timeout: 10000 }).should('be.visible');

        cy.get('#delete-button').click();
        cy.get('#yesBtn').click();
        cy.contains('No secrets found.', { timeout: 10000 }).should(
            'be.visible'
        );
    });
});
