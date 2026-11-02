describe('deployments section', function () {
    const deploymentTitle = `fl-test-${Date.now()}`;

    before(function () {
        cy.env(['EMAIL', 'PASSWORD']).then(({ EMAIL, PASSWORD }) => {
            cy.login(EMAIL, PASSWORD);
        });
        cy.closeAccessLevelPopup();

        cy.contains('Tools', { timeout: 20000 }).click({ force: true });
        cy.contains('Federated learning with Flower', {
            timeout: 20000,
        }).click({ force: true });
        cy.get('#deploy-tool-button', { timeout: 10000 }).click();
        cy.get('#deployment-title', { timeout: 10000 }).type(deploymentTitle);
        cy.contains('Quick submit', { timeout: 20000 }).click();
    });

    after(function () {
        cy.visit('/tasks/deployments');
        cy.contains('.deployments-table__name', deploymentTitle, {
            timeout: 30000,
        })
            .closest('[role="row"]')
            .within(() => {
                cy.get('.deployments-table__actions app-ui-button')
                    .last()
                    .click();
            });
        cy.get('#optionB').click();
        cy.contains('.deployments-table__name', deploymentTitle).should(
            'not.exist'
        );
    });

    it('shows the deployment after creation', function () {
        cy.contains('Deployments', { timeout: 20000 }).should('be.visible');
        cy.contains('Modules', { timeout: 50000 }).should('be.visible');
        cy.contains('Tools').should('be.visible');
        cy.contains('Deployment created with ID', { timeout: 20000 }).should(
            'be.visible'
        );
        cy.contains('ai4oshub/ai4os-federated-server:latest', {
            timeout: 50000,
        }).should('be.visible');
        cy.contains('.deployments-table__name', deploymentTitle, {
            timeout: 50000,
        }).should('be.visible');
    });

    it('opens the deployment secrets tab', function () {
        cy.contains('.deployments-table__name', deploymentTitle)
            .closest('[role="row"]')
            .find(
                '.deployments-table__actions app-ui-button[tooltip="Manage secrets"]'
            )
            .click();
        cy.get('#secrets-tab', { timeout: 20000 }).should('be.visible');
        cy.get('.deployment-secrets').should('be.visible');
        cy.contains('.secret-item', 'default').should('be.visible');
    });

    it('shows and copies a secret', function () {
        cy.get('.secret-item')
            .first()
            .find('.ui-credential-row__icon')
            .first()
            .click();
        cy.get('.secret-item')
            .first()
            .find('.ui-credential-row__value')
            .should(($value) => {
                expect($value.text().trim()).not.to.match(/^•+$/);
            });

        cy.get('.secret-item')
            .first()
            .find('.ui-credential-row__icon')
            .last()
            .click();
        cy.contains('Copied to clipboard!').should('be.visible');
    });

    it('creates a secret', function () {
        cy.get('.new-secret input').type('client1');
        cy.get('.new-secret app-ui-button button').click();
        cy.contains('Successfully created secret with name: client1', {
            timeout: 20000,
        }).should('be.visible');
        cy.contains('.secret-item', 'client1').should('be.visible');
    });

    it('rejects a duplicated secret name', function () {
        cy.get('.new-secret input').type('client1').blur();
        cy.contains('Secret names must be unique').should('be.visible');
        cy.get('.new-secret app-ui-button button').should('be.disabled');
    });

    it('rejects a whitespace-only secret name', function () {
        cy.get('.new-secret input').clear().type('    ').blur();
        cy.contains('Secret names cannot be whitespaces').should('be.visible');
        cy.get('.new-secret app-ui-button button').should('be.disabled');
    });

    it('deletes a secret', function () {
        cy.contains('.secret-item', 'client1').find('app-ui-button').click();
        cy.get('.confirmation-dialog').should('be.visible');
        cy.get('#optionB').click();
        cy.contains('.secret-item', 'client1').should('not.exist');
    });

    it('deletes the last secret with a warning', function () {
        cy.contains('.secret-item', 'default').find('app-ui-button').click();
        cy.get('.confirmation-dialog')
            .should('be.visible')
            .and(
                'contain.text',
                'Be careful! Some tools need at least one secret to work'
            );
        cy.get('#optionB').click();
        cy.contains('No secrets found.', { timeout: 10000 }).should(
            'be.visible'
        );
    });
});
