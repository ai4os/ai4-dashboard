describe('dashboard section', function () {
    before(function () {
        cy.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
        cy.contains('Dashboard', { timeout: 10000 }).click();
    });

    it('shows datacenter section', function () {
        cy.contains('Overview', { timeout: 10000 }).should('be.visible');
        cy.contains('Datacenters').should('be.visible');
        cy.contains('Graphs').should('be.visible');
        cy.contains('Nodes').should('be.visible');
    });

    it('shows dashboard tab', function () {
        cy.get('#title-cluster', { timeout: 10000 }).contains(
            'Cluster Usage Overview'
        );
        cy.get('app-stat-card')
            .find('.header p:contains("CPUs")')
            .should('have.length', 1);
        cy.get('app-stat-card')
            .find('.header p:contains("Memory")')
            .should('have.length', 1);
        cy.get('app-stat-card')
            .find('.header p:contains("Disk")')
            .should('have.length', 1);
        cy.get('app-stat-card')
            .find('.header p:contains("GPUs")')
            .should('have.length', 1);

        cy.get('#title-user').contains('Your Usage');
        cy.get('mat-card')
            .find('.stat-text:contains("Number of Jobs")')
            .should('have.length', 1);
        cy.get('mat-card')
            .find('.stat-text:contains("CPUs")')
            .should('have.length', 1);
        cy.get('mat-card')
            .find('.stat-text:contains("CPU Frequency")')
            .should('have.length', 1);
        cy.get('mat-card')
            .find('.stat-text:contains("Memory")')
            .should('have.length', 1);
        cy.get('mat-card')
            .find('.stat-text:contains("Disk")')
            .should('have.length', 1);
        cy.get('mat-card')
            .find('.stat-text:contains("GPUs")')
            .should('have.length', 1);
    });

    it('shows datacenters tab', function () {
        cy.contains('Datacenters', { timeout: 8000 }).click();
        cy.get('canvas').should('be.visible');
    });

    it('shows graphs tab', function () {
        cy.contains('Graphs', { timeout: 10000 }).click();
        cy.contains('AI4EOSC Usage Over Time').should('be.visible');

        cy.contains('Running deployments').should('be.visible');
        cy.get('canvas').should('be.visible');

        cy.contains('Queued deployments').should('be.visible');
        cy.contains('Queued deployments').click();
        cy.get('canvas').should('be.visible');

        cy.contains('CPUs').should('be.visible');
        cy.contains('CPUs').click();
        cy.get('canvas').should('be.visible');

        cy.contains('CPU Mhz').should('be.visible');
        cy.contains('CPU Mhz').click();
        cy.get('canvas').should('be.visible');

        cy.contains('Memory MB').should('be.visible');
        cy.contains('Memory MB').click();
        cy.get('canvas').should('be.visible');

        cy.contains('Disk MB').should('be.visible');
        cy.contains('Disk MB').click();
        cy.get('canvas').should('be.visible');

        cy.contains('GPUs').should('be.visible');
        cy.contains('GPUs').click();
        cy.get('canvas').should('be.visible');

        cy.get('#title-aggregate').contains('Aggregate Resource Usage');
        cy.get('app-stat-card')
            .find('.header p:contains("CPUs")')
            .should('have.length', 1);
        cy.get('app-stat-card')
            .find('.header p:contains("Memory")')
            .should('have.length', 1);
        cy.get('app-stat-card')
            .find('.header p:contains("Disk")')
            .should('have.length', 1);
        cy.get('app-stat-card')
            .find('.header p:contains("GPUs")')
            .should('have.length', 1);
    });

    it('shows nodes tab', function () {
        cy.contains('Nodes', { timeout: 10000 }).click();
        cy.get('#nodes-cpu-title').contains('Nodes with CPU');
        cy.get('#nodes-gpu-title').contains('Nodes with GPU');
        cy.get('mat-accordion').should('have.length', 2);
        cy.get('mat-paginator').should('have.length', 2);
    });
});
