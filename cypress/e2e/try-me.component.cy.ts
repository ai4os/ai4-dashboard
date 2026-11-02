describe('try me section', function () {
    before(function () {
        cy.env(['EMAIL', 'PASSWORD']).then(({ EMAIL, PASSWORD }) => {
            cy.login(EMAIL, PASSWORD);
        });
        cy.closeAccessLevelPopup();
    });

    it('shows an empty Try me list', function () {
        cy.visit('/tasks/try-me');
        cy.get('h1', { timeout: 20000 }).should('contain.text', 'Try me');
        cy.contains('Name').should('be.visible');
        cy.contains('Status').should('be.visible');
        cy.contains('Container name').should('be.visible');
        cy.contains('Creation time (UTC)').should('be.visible');
        cy.contains('Actions').should('be.visible');
        cy.contains('Nothing deployed yet', { timeout: 50000 }).should(
            'be.visible'
        );
    });

    it('creates a Gradio deployment', function () {
        cy.get('#sidebarMenu a').contains('Modules').click();
        cy.contains('Dogs breed detector', { timeout: 20000 }).click();
        cy.window().then((win) => {
            cy.stub(win, 'open')
                .callsFake((url) => {
                    win.location.href = String(url);
                })
                .as('popup');
        });

        cy.get('.action-buttons-container app-ui-button')
            .contains('Try')
            .click();
        cy.contains('User Interface').click();
        cy.get('@popup').should('be.called');
        cy.contains(
            'Initializing the environment ... This might take some time',
            { timeout: 50000 }
        ).should('be.visible');
        cy.contains('Launching the UI ...', { timeout: 80000 }).should(
            'be.visible'
        );
        cy.url({ timeout: 80000 }).should(
            'not.include',
            '/catalog/modules/dogs-breed-detector/try-me-nomad'
        );
    });

    it('shows the created deployment in the list', function () {
        cy.visit('/tasks/try-me');
        cy.get('h1', { timeout: 20000 }).should('contain.text', 'Try me');
        cy.contains('Nothing deployed yet', { timeout: 50000 }).should(
            'not.exist'
        );
        cy.get('.deployments-table__name', { timeout: 50000 }).should(
            'have.length.at.least',
            1
        );
    });

    it('shows deployment details', function () {
        cy.visit('/tasks/try-me');
        cy.get('.deployments-table__actions app-ui-button', {
            timeout: 50000,
        })
            .first()
            .click();
        cy.url().should('match', /\/tasks\/try-me\/[^/]+/);
        cy.get('h1').should(($heading) => {
            expect($heading.text().trim()).not.to.equal('');
        });
        cy.contains('Docker image').should('be.visible');
        cy.contains('ai4oshub/dogs-breed-detector:latest').should('be.visible');
        cy.contains('Endpoints').should('be.visible');
    });

    it('shows a quick-access endpoint for the deployment', function () {
        cy.visit('/tasks/try-me');
        cy.get('.deployments-table__actions app-ui-button', {
            timeout: 50000,
        })
            .eq(1)
            .find('a')
            .should('have.attr', 'href')
            .and('include', 'ui-');
    });

    it('deletes the Gradio deployment', function () {
        cy.visit('/tasks/try-me');
        cy.get('.deployments-table__actions app-ui-button', {
            timeout: 50000,
        })
            .last()
            .click();
        cy.get('#optionB').click();
        cy.contains('Successfully deleted deployment with uuid:', {
            timeout: 50000,
        }).should('be.visible');
        cy.contains('Nothing deployed yet', { timeout: 50000 }).should(
            'be.visible'
        );
    });
});
