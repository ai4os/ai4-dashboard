import { TestBed } from '@angular/core/testing';

import { ModulesService } from './modules.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { endpoints } from '@environments/endpoints';
import { TagObject } from '@app/data/types/tags';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { provideHttpClient } from '@angular/common/http';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import {
    mockAi4lifeModules,
    mockModuleSummaryList,
    mockedModuleConfiguration,
} from '@app/shared/mocks/modules-service.mock';

const { base } = environment.api;

describe('ModulesService', () => {
    let service: ModulesService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                OAuthStorage,
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ModulesService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getModulesSummary should return a list of detailed modules', (done) => {
        const expectedUrl = `${base}${endpoints.modulesSummary}`;

        service.getModulesSummary().subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(mockModuleSummaryList);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                !r.params.has('tags') // sin filtro
        );

        req.flush(mockModuleSummaryList);
    });

    it('getModulesSummary should return a list of detailed modules by tag', (done) => {
        const tag: TagObject = { tags: 'development' };
        const expectedUrl = `${base}${endpoints.modulesSummary}`;

        service.getModulesSummary(tag).subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(mockModuleSummaryList[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('tags') === tag.tags
        );

        req.flush(mockModuleSummaryList[0]);
    });

    it('getModule should return the metadata of a module', (done) => {
        const moduleName = 'test';
        const expectedUrl = `${base}${endpoints.module.replace(':name', moduleName)}`;

        service.getModule(moduleName).subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(mockModuleSummaryList[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) => r.method === 'GET' && r.url === expectedUrl
        );

        req.flush(mockModuleSummaryList[0]);
    });

    it('getModuleNomadConfiguration should return the nomad configuration for a module', (done) => {
        const moduleName = 'test';
        const expectedUrl = `${base}${endpoints.moduleNomadConfiguration.replace(':name', moduleName)}`;

        service
            .getModuleNomadConfiguration(moduleName)
            .subscribe((asyncData) => {
                try {
                    expect(asyncData).toEqual(mockedModuleConfiguration);
                    done();
                } catch (error) {
                    done(error);
                }
            });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('vo') === 'vo.ai4eosc.eu'
        );

        req.flush(mockedModuleConfiguration);
    });

    it('getModuleOscarConfiguration should return the oscar configuration for a module', (done) => {
        const moduleName = 'test';
        const expectedUrl = `${base}${endpoints.moduleOscarConfiguration}`;

        service
            .getModuleOscarConfiguration(moduleName)
            .subscribe((asyncData) => {
                try {
                    expect(asyncData).toEqual(mockedModuleConfiguration);
                    done();
                } catch (error) {
                    done(error);
                }
            });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('item_name') === moduleName &&
                r.params.get('vo') === 'vo.ai4eosc.eu'
        );

        req.flush(mockedModuleConfiguration);
    });

    it('getAi4lifeModules should return mapped ai4life modules', (done) => {
        const expectedUrl = endpoints.ai4lifeModulesSummary;

        service.getAi4lifeModules().subscribe((modules) => {
            try {
                expect(modules.length).toBe(2);
                expect(modules[0].id).toBe('philosophical-panda');
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) => r.method === 'GET' && r.url === expectedUrl
        );

        req.flush(mockAi4lifeModules);
    });
});
