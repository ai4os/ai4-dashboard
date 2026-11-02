describe('module train form', function () {
    let deploymentTitle = '';
    let createdDeploymentTitle: string | null = null;
    let deploymentNumber = 0;
    const zenodoDatasetTitle =
        'EyeOnWater training dataset for assessing the inclusion of water images';

    const stubZenodoDataset = () => {
        cy.intercept('POST', /\/proxies\/zenodo/, (request) => {
            const apiRoute =
                new URL(request.url).searchParams.get('api_route') ?? '';

            if (apiRoute.startsWith('communities/')) {
                request.reply({
                    body: {
                        hits: {
                            total: 1,
                            hits: [
                                {
                                    id: 'cypress-zenodo-record',
                                    created: '2024-01-01T00:00:00Z',
                                    doi_url:
                                        'https://doi.org/10.5281/zenodo.14017143',
                                    doi: '10.5281/zenodo.14017143',
                                    title: zenodoDatasetTitle,
                                    metadata: {
                                        description: '',
                                        creators: [{ name: 'Cypress test' }],
                                        keywords: [],
                                        communities: [{ id: 'ai4eosc' }],
                                    },
                                },
                            ],
                        },
                    },
                });
            } else if (apiRoute.endsWith('/versions')) {
                request.reply({
                    body: {
                        hits: {
                            total: 1,
                            hits: [
                                {
                                    id: 'cypress-zenodo-version',
                                    title: zenodoDatasetTitle,
                                    doi: '10.5281/zenodo.14017143',
                                    metadata: {
                                        version: 1,
                                        relations: {
                                            version: [{ is_last: true }],
                                        },
                                    },
                                },
                            ],
                        },
                    },
                });
            } else {
                request.reply({
                    body: {
                        doi: '10.5281/zenodo.14017143',
                        title: zenodoDatasetTitle,
                    },
                });
            }
        }).as('zenodoDataset');
    };

    before(function () {
        cy.env(['EMAIL', 'PASSWORD']).then(({ EMAIL, PASSWORD }) => {
            cy.login(EMAIL, PASSWORD);
        });
        cy.closeAccessLevelPopup();
    });

    after(function () {
        if (createdDeploymentTitle) {
            cy.intercept('GET', '**/deployments/modules*').as(
                'moduleDeployments'
            );
            cy.visit('/tasks/deployments');
            cy.wait('@moduleDeployments');
            cy.get('body').then(($body) => {
                const normalizedTitle = createdDeploymentTitle?.replace(
                    /\s/g,
                    ''
                );
                const matchingName = $body
                    .find('.deployments-table__name')
                    .filter((_, name) =>
                        name.textContent
                            ?.replace(/\s/g, '')
                            .includes(normalizedTitle ?? '')
                    )
                    .first();

                if (matchingName.length) {
                    cy.wrap(matchingName)
                        .closest('[role="row"]')
                        .find('.deployments-table__actions app-ui-button')
                        .last()
                        .click();
                    cy.get('#optionB').click();
                    cy.contains(
                        '.deployments-table__name',
                        createdDeploymentTitle!
                    ).should('not.exist');
                }
            });
        }
    });

    describe('Tests with Nextcloud credentials', () => {
        before(() => {
            cy.addNextcloudStorageCredentials();
        });

        beforeEach(() => {
            deploymentTitle = `cypress-train-${Date.now()}-${++deploymentNumber}`;
            cy.initializeTrainModuleForm(deploymentTitle);
        });

        it('adds a Zenodo dataset and validates storage requirements', function () {
            stubZenodoDataset();
            cy.contains('Add dataset', { timeout: 10000 }).click();
            cy.get('app-ui-autocomplete input', { timeout: 10000 })
                .clear()
                .type('iMagine project');
            cy.contains('.ui-autocomplete-panel__option', 'iMagine project', {
                timeout: 10000,
            }).click();

            cy.wait('@zenodoDataset');
            cy.get('.confirmation-dialog app-ui-select').first().click();
            cy.contains('.ui-select-panel__option', zenodoDatasetTitle).click();
            cy.wait('@zenodoDataset');
            cy.get('.confirmation-dialog__actions app-ui-button')
                .last()
                .click();
            cy.wait('@zenodoDataset');
            cy.get('.confirmation-dialog__actions app-ui-button')
                .first()
                .click();

            cy.get('.ui-table__row', { timeout: 10000 }).should(
                'contain.text',
                zenodoDatasetTitle
            );
            cy.contains(
                'To download a dataset, you need to select a storage or use your rclone credentials'
            ).should('be.visible');
            cy.contains('button', 'Submit').should('be.disabled');
        });

        it('adds a dataset via DOI and validates storage requirements', function () {
            cy.contains('Add dataset', { timeout: 10000 }).click();
            cy.get('.confirmation-dialog #doi-tab').click();

            cy.get('.confirmation-dialog app-ui-text-field input').type(
                '10.5281/zenodo.10777441'
            );
            cy.get('.confirmation-dialog__actions app-ui-button')
                .last()
                .click();
            cy.get('.confirmation-dialog__actions app-ui-button')
                .first()
                .click();

            cy.get('.ui-table__row').should(
                'contain.text',
                '10.5281/zenodo.10777441'
            );
            cy.contains(
                'To download a dataset, you need to select a storage or use your rclone credentials'
            ).should('be.visible');
            cy.contains('button', 'Submit').should('be.disabled');
        });

        it('adds a dataset via URL and validates storage requirements', function () {
            cy.contains('Add dataset', { timeout: 10000 }).click();
            cy.get('.confirmation-dialog #doi-tab').click();

            cy.get('.confirmation-dialog app-ui-text-field input').type(
                'https://huggingface.co/datasets/Zyphra/Zyda-2'
            );
            cy.get('.confirmation-dialog__actions app-ui-button')
                .last()
                .click();
            cy.get('.confirmation-dialog__actions app-ui-button')
                .first()
                .click();

            cy.get('.ui-table__row').should(
                'contain.text',
                'https://huggingface.co/datasets/Zyphra/Zyda-2'
            );
            cy.contains(
                'To download a dataset, you need to select a storage or use your rclone credentials'
            ).should('be.visible');
            cy.contains('button', 'Submit').should('be.disabled');
        });

        it('delete dataset', function () {
            cy.contains('Add dataset', { timeout: 10000 }).click();
            cy.get('.confirmation-dialog #doi-tab').click();

            cy.get('.confirmation-dialog app-ui-text-field input').type(
                '10.5281/zenodo.10777441'
            );
            cy.get('.confirmation-dialog__actions app-ui-button')
                .last()
                .click();
            cy.get('.confirmation-dialog__actions app-ui-button')
                .first()
                .click();

            cy.get('app-ui-table .ui-table__row')
                .first()
                .find('app-ui-button')
                .click();
            cy.get('#optionB').click();
            cy.contains('No datasets added yet').should('be.visible');
        });

        it('cannot add duplicated dataset', function () {
            cy.contains('Add dataset', { timeout: 10000 }).click();
            cy.get('.confirmation-dialog #doi-tab').click();

            cy.get('.confirmation-dialog app-ui-text-field input').type(
                '10.5281/zenodo.10777441'
            );
            cy.get('.confirmation-dialog__actions app-ui-button')
                .last()
                .click();

            cy.get('.confirmation-dialog app-ui-text-field input').type(
                '10.5281/zenodo.10777441'
            );
            cy.get('.confirmation-dialog__actions app-ui-button')
                .last()
                .click();

            cy.contains(
                'Dataset with reference 10.5281/zenodo.10777441 already exists'
            ).should('be.visible');
            cy.get('.confirmation-dialog__actions app-ui-button')
                .first()
                .click();
        });

        it('cannot add more than 5 datasets', function () {
            cy.contains('Add dataset', { timeout: 10000 }).click();
            cy.get('.confirmation-dialog #doi-tab').click();

            [
                '10.5281/zenodo.10777441',
                '10.5282/zenodo.10777441',
                '10.5283/zenodo.10777441',
                '10.5284/zenodo.10777441',
                '10.5285/zenodo.10777441',
                '10.5286/zenodo.10777441',
            ].forEach((doi) => {
                cy.get('.confirmation-dialog app-ui-text-field input').type(
                    doi
                );
                cy.get('.confirmation-dialog__actions app-ui-button')
                    .last()
                    .click();
            });

            cy.contains(
                "Can't add more than 5 datasets in a single deployment"
            ).should('be.visible');
            cy.get('.confirmation-dialog__actions app-ui-button')
                .first()
                .click();
        });

        it('cannot create module with dataset and a wrong DOI/URL', function () {
            cy.contains('Add dataset', { timeout: 10000 }).click();
            cy.get('.confirmation-dialog #doi-tab').click();
            cy.get('.confirmation-dialog app-ui-text-field input')
                .type('ps://huggingface.co/datasets/Zyphra/Zyda-2')
                .blur();
            cy.contains('Invalid DOI or URL format').should('be.visible');
            cy.get('.confirmation-dialog__actions app-ui-button')
                .last()
                .find('button')
                .should('be.disabled');
            cy.get('.confirmation-dialog__actions app-ui-button')
                .first()
                .click();
        });
    });

    describe('Tests without Nextcloud credentials', () => {
        before(() => {
            cy.deleteNextcloudStorageCredentials();
        });

        beforeEach(() => {
            deploymentTitle = `cypress-train-${Date.now()}-${++deploymentNumber}`;
            cy.initializeTrainModuleForm(deploymentTitle);
        });

        it('create module with no datasets', function () {
            cy.wait(5000);
            cy.get('app-ui-button')
                .contains('Submit', { timeout: 10000 })
                .click({ force: true });
            cy.contains('ai4oshub/dogs-breed-detector:latest', {
                timeout: 30000,
            }).should('be.visible');
            createdDeploymentTitle = deploymentTitle;
        });

        it('cannot create module with datasets without rclone credentials', function () {
            stubZenodoDataset();
            cy.contains('Add dataset', { timeout: 10000 }).click();
            cy.get('app-ui-autocomplete input', { timeout: 10000 })
                .clear()
                .type('iMagine project');
            cy.contains('.ui-autocomplete-panel__option', 'iMagine project', {
                timeout: 10000,
            }).click();

            cy.wait('@zenodoDataset');
            cy.get('.confirmation-dialog app-ui-select').first().click();
            cy.contains('.ui-select-panel__option', zenodoDatasetTitle).click();
            cy.wait('@zenodoDataset');
            cy.get('.confirmation-dialog__actions app-ui-button')
                .last()
                .click();
            cy.wait('@zenodoDataset');
            cy.get('.confirmation-dialog__actions app-ui-button')
                .first()
                .click();

            cy.get('.ui-table__row').should('contain.text', zenodoDatasetTitle);
            cy.contains(
                'To download a dataset, you need to select a storage or use your rclone credentials'
            ).should('be.visible');

            cy.contains('button', 'Submit').should('be.disabled');
        });
    });
});
