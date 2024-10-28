describe('module train form', function () {
    before(function () {
        cy.login(Cypress.env('EMAIL'), Cypress.env('PASSWORD'));
    });

    beforeEach(function () {
        cy.initializeTrainModuleForm();
    });

    it('create module with no datasets', function () {
        cy.contains('Submit', { timeout: 10000 }).click({ force: true });
        cy.contains('ai4oshub/dogs-breed-detector:latest', {
            timeout: 30000,
        }).should('be.visible');
    });

    it('create module with dataset via zenodo', function () {
        cy.contains('Add dataset', { timeout: 10000 }).click();
        cy.get('#community', { timeout: 10000 }).clear();
        cy.get('#community', { timeout: 10000 }).type('iMagine project');
        cy.get('#community', { timeout: 10000 }).type('{enter}');
        cy.wait(1000);

        cy.get('#dataset', { timeout: 30000 }).click();
        cy.contains(
            'EyeOnWater training dataset for assessing the inclusion of water images',
            { timeout: 15000 }
        ).click();
        cy.get('#add-button', { timeout: 15000 }).click();
        cy.contains(' Dataset added with reference 10.5281/zenodo.10777441', {
            timeout: 10000,
        }).should('be.visible');
        cy.contains('Close', { timeout: 10000 }).click();

        cy.contains('Advanced settings', { timeout: 10000 }).click();
        cy.get('#rcloneUser', { timeout: 10000 }).type('UserTest');
        cy.get('#rclonePassword', { timeout: 10000 }).type('1234');
        cy.contains('Submit', { timeout: 10000 }).click();
    });

    it('create module with dataset via DOI', function () {
        cy.contains('Add dataset', { timeout: 10000 }).click();
        cy.get('div[role=tab]').eq(1).click();

        cy.get('#doi', { timeout: 10000 }).type('10.5281/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();
        cy.contains(
            ' Dataset added with reference 10.5281/zenodo.10777441'
        ).should('be.visible');
        cy.contains('Close', { timeout: 10000 }).click();

        cy.contains('Advanced settings', { timeout: 10000 }).click();
        cy.get('#rcloneUser', { timeout: 10000 }).type('UserTest');
        cy.get('#rclonePassword', { timeout: 10000 }).type('1234');
        cy.contains('Submit', { timeout: 10000 }).click();
    });

    it('create module with dataset via URL', function () {
        cy.contains('Add dataset', { timeout: 10000 }).click();
        cy.get('div[role=tab]').eq(1).click();

        cy.get('#doi', { timeout: 10000 }).type(
            'https://huggingface.co/datasets/Zyphra/Zyda-2'
        );
        cy.get('#add-button', { timeout: 10000 }).click();
        cy.contains(
            ' Dataset added with reference https://huggingface.co/datasets/Zyphra/Zyda-2'
        ).should('be.visible');
        cy.contains('Close', { timeout: 10000 }).click();

        cy.contains('Advanced settings', { timeout: 10000 }).click();
        cy.get('#rcloneUser', { timeout: 10000 }).type('UserTest');
        cy.get('#rclonePassword', { timeout: 10000 }).type('1234');
        cy.contains('Submit', { timeout: 10000 }).click();
    });

    it('cannot create module with dataset and a wrong DOI/URL', function () {
        cy.contains('Add dataset', { timeout: 10000 }).click();
        cy.get('div[role=tab]').eq(1).click();
        cy.get('#doi', { timeout: 10000 }).type(
            'ps://huggingface.co/datasets/Zyphra/Zyda-2'
        );
        cy.get('div[role=tab]').eq(1).click();
        cy.contains('Invalid DOI or URL format').should('be.visible');
        cy.get('#add-button').should('be.disabled');
        cy.contains('Close', { timeout: 10000 }).click();
    });

    it('cannot create module with datasets without rclone credentials', function () {
        cy.contains('Add dataset', { timeout: 10000 }).click();
        cy.get('#community', { timeout: 10000 }).clear();
        cy.get('#community', { timeout: 10000 }).type('iMagine project');
        cy.get('#community', { timeout: 10000 }).type('{enter}');
        cy.wait(1000);

        cy.get('#dataset', { timeout: 25000 }).click();
        cy.contains(
            'EyeOnWater training dataset for assessing the inclusion of water images',
            { timeout: 10000 }
        ).click();
        cy.get('#add-button', { timeout: 25000 }).click();
        cy.contains(
            'Dataset added with reference 10.5281/zenodo.10777441'
        ).should('be.visible');

        cy.contains('Close', { timeout: 10000 }).click();

        cy.contains('Advanced settings', { timeout: 10000 }).click();
        cy.contains('You must specify a RCLONE account').should('be.visible');
        cy.contains('Submit').should('be.disabled');
    });

    it('delete dataset', function () {
        cy.contains('Add dataset', { timeout: 10000 }).click();
        cy.get('div[role=tab]').eq(1).click();

        cy.get('#doi', { timeout: 10000 }).type('10.5281/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();
        cy.contains('Close', { timeout: 10000 }).click();

        cy.get('#delete-button').click();
        cy.get('#yesBtn').click();
        cy.contains('No datasets added yet').should('be.visible');
    });

    it('cannot add duplicated dataset', function () {
        cy.contains('Add dataset', { timeout: 10000 }).click();
        cy.get('div[role=tab]').eq(1).click();

        cy.get('#doi', { timeout: 10000 }).type('10.5281/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();

        cy.get('div[role=tab]').eq(1).click();
        cy.get('#doi', { timeout: 10000 }).type('10.5281/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();

        cy.contains(
            'Dataset with reference 10.5281/zenodo.10777441 already exists'
        ).should('be.visible');
        cy.contains('Close', { timeout: 10000 }).click();
    });

    it('cannot add more than 5 datasets', function () {
        cy.contains('Add dataset', { timeout: 10000 }).click();
        cy.get('div[role=tab]').eq(1).click();

        cy.get('#doi', { timeout: 10000 }).type('10.5281/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();

        cy.get('div[role=tab]').eq(1).click();
        cy.get('#doi', { timeout: 10000 }).type('10.5282/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();

        cy.get('div[role=tab]').eq(1).click();
        cy.get('#doi', { timeout: 10000 }).type('10.5283/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();

        cy.get('div[role=tab]').eq(1).click();
        cy.get('#doi', { timeout: 10000 }).type('10.5284/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();

        cy.get('div[role=tab]').eq(1).click();
        cy.get('#doi', { timeout: 10000 }).type('10.5285/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();

        cy.get('div[role=tab]').eq(1).click();
        cy.get('#doi', { timeout: 10000 }).type('10.5286/zenodo.10777441');
        cy.get('#add-button', { timeout: 10000 }).click();

        cy.contains(
            "Can't add more than 5 datasets in a single deployment"
        ).should('be.visible');
        cy.contains('Close', { timeout: 10000 }).click();
    });
});
