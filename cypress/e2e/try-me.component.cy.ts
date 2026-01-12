describe('try me section', function () {
    before(function () {
        cy.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
        cy.closeAccessLevelPopup();
    });

    it('try me list shows no Gradio deployments', function () {
        cy.contains('Try me', { timeout: 20000 }).click({ force: true });
        cy.contains('Try me deployments', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Gradio', { timeout: 50000 }).should('be.visible');
        cy.contains('Name', { timeout: 50000 }).should('be.visible');
        cy.contains('Status', { timeout: 50000 }).should('be.visible');
        cy.contains('Container name', { timeout: 50000 }).should('be.visible');
        cy.contains('Creation time (UTC)', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Actions', { timeout: 50000 }).should('be.visible');
        cy.contains('Nothing deployed yet', { timeout: 50000 }).should(
            'be.visible'
        );
    });

    it('creates Gradio deployment', function () {
        cy.contains('Modules', { timeout: 20000 }).click();
        cy.contains('Dogs breed detector', { timeout: 20000 }).click();
        cy.window().then((win) => {
            cy.stub(win, 'open')
                .callsFake((url) => {
                    win.location.href = url;
                })
                .as('popup');
        });
        cy.get('.action-button').contains('Try', { timeout: 10000 }).click();
        cy.contains('User Interface').click();
        cy.get('@popup').should('be.called');
        cy.contains(
            'Initializing the environment ... This might take some time',
            { timeout: 50000 }
        ).should('be.visible');
        cy.contains('Launching the UI ...', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.url({ timeout: 50000 }).should(
            'not.equal',
            'http://localhost:8080/catalog/modules/dogs-breed-detector/try-me-nomad'
        );
    });

    it('try me list shows one Gradio deployment', function () {
        cy.visit('http://localhost:8080/try-me');
        cy.contains('Try me', { timeout: 20000 }).click();
        cy.contains('Try me deployments', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Gradio', { timeout: 50000 }).should('be.visible');
        cy.contains('Name', { timeout: 50000 }).should('be.visible');
        cy.contains('Status', { timeout: 50000 }).should('be.visible');
        cy.contains('Container name', { timeout: 50000 }).should('be.visible');
        cy.contains('Creation time (UTC)', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Actions', { timeout: 50000 }).should('be.visible');
        cy.contains('Nothing deployed yet').should('not.exist');
    });

    it('show Gradio deployment details', function () {
        cy.visit('http://localhost:8080/try-me');
        cy.contains('Try me', { timeout: 20000 }).click();
        cy.contains('Try me deployments', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.get('#infoButton', { timeout: 50000 }).click();
        cy.contains('Deployment detail', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Deployment ID', { timeout: 50000 }).should('be.visible');
        cy.contains('Description', { timeout: 50000 }).should('be.visible');
        cy.contains('-', { timeout: 50000 }).should('be.visible');
        cy.contains('Docker image', { timeout: 50000 }).should('be.visible');
        cy.contains('ai4oshub/dogs-breed-detector:latest', {
            timeout: 50000,
        }).should('be.visible');
        cy.contains('Creation time (UTC)', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Resources', { timeout: 50000 }).should('be.visible');
        cy.contains('CPU frequency: 2000 MHz', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Number of CPUs: 1', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Disk memory: 300 MB', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Number of GPUs: 0', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('RAM memory: 2000 MB', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.contains('Datacenter', { timeout: 50000 }).should('be.visible');
        cy.contains('ifca-ai4eosc', { timeout: 50000 }).should('be.visible');
        cy.contains('Endpoints', { timeout: 50000 }).should('be.visible');
        cy.contains('UI', { timeout: 50000 }).should('be.visible');
        cy.contains('Close', { timeout: 20000 }).click();
    });

    it('show Gradio deployment UI', function () {
        cy.contains('Try me', { timeout: 20000 }).click();
        cy.contains('Try me deployments', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.get('#infoButton', { timeout: 50000 }).click();
        cy.contains('Deployment detail', { timeout: 50000 }).should(
            'be.visible'
        );
        cy.get('#uuid').then(($uuid) => {
            const uuid = $uuid.text();

            cy.window().then((win) => {
                cy.spy(win, 'open').as('popup2');

                win.open(
                    'http://ui-' + uuid + '.ifca-deployments.cloud.ai4eosc.eu/'
                );
            });
        });
        cy.contains('UI', { timeout: 50000 }).click();
        cy.get('@popup2', { timeout: 20000 }).should('be.called');
        cy.contains('Close', { timeout: 20000 }).click();
    });

    it('show Gradio deployment quick access', function () {
        cy.get('#infoButton', { timeout: 50000 }).click();
        cy.get('#uuid').then(($uuid) => {
            const uuid = $uuid.text();
            cy.contains('Close', { timeout: 20000 }).click();
            cy.get('#quickAccessButton', { timeout: 15000 }).click();
            cy.window().then((win) => {
                cy.spy(win, 'open').as('popup');
                win.open(
                    'http://ui-' + uuid + '.ifca-deployments.cloud.ai4eosc.eu/'
                );
            });
        });
        cy.get('@popup', { timeout: 20000 }).should('be.called');
    });

    it('delete Gradio deployment', function () {
        cy.get('#deleteButton', { timeout: 50000 }).click();
        cy.get('#yesBtn').click();
        cy.contains('Successfully deleted deployment with uuid:', {
            timeout: 50000,
        }).should('be.visible');
        cy.contains('Nothing deployed yet', { timeout: 50000 }).should(
            'be.visible'
        );
    });
});
