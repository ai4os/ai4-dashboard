describe('platform statistics', function () {
    before(function () {
        cy.env(['EMAIL', 'PASSWORD']).then(({ EMAIL, PASSWORD }) => {
            cy.login(EMAIL, PASSWORD);
        });
        cy.closeAccessLevelPopup();
    });

    beforeEach(function () {
        cy.visit('/statistics/platform');
    });

    it('shows the platform statistics page and tabs', function () {
        cy.get('h1').should('contain.text', 'Platform statistics');
        cy.get('#usage-tab').should('be.visible');
        cy.get('#footprint-tab').should('be.visible');
        cy.get('#datacenters-tab').should('be.visible');
    });

    it('shows platform usage when the tab is selected', function () {
        cy.get('#usage-tab').click();
        cy.get('#usage-tab').should('have.class', 'ui-tabs__item--active');
        cy.get('app-platform-usage-tab, #error').should('exist');
    });

    it('shows datacenters when the tab is selected', function () {
        cy.get('#datacenters-tab').click();
        cy.get('#datacenters-tab').should(
            'have.class',
            'ui-tabs__item--active'
        );
        cy.get('app-datacenters-tab, #error').should('exist');
    });

    it('shows the footprint tab', function () {
        cy.get('#footprint-tab').click();
        cy.get('#footprint-tab').should('have.class', 'ui-tabs__item--active');
        cy.get('app-platform-footprint-tab, #error').should('exist');
    });

    it('shows a message when platform statistics are unavailable', function () {
        cy.intercept('GET', '**/deployments/stats/cluster*', {
            statusCode: 503,
            body: {},
        }).as('clusterStatsUnavailable');

        cy.visit('/statistics/platform');
        cy.wait('@clusterStatsUnavailable');

        cy.get('#error')
            .should('be.visible')
            .and('contain.text', 'Statistics are not available at the moment');
    });
});
