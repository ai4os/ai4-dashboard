import { TestBed } from '@angular/core/testing';

import { ModulesService } from './modules.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { endpoints } from '@environments/endpoints';
import { of } from 'rxjs';
import { TagObject } from '@app/data/types/tags';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { provideHttpClient } from '@angular/common/http';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import {
    mockAi4eoscModules,
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
        jest.mock('./modules.service', () => ({
            getModulesSummary: jest
                .fn()
                .mockReturnValue(of(mockModuleSummaryList))
                .mockReturnValue(of(mockModuleSummaryList[0])),
            getModule: jest.fn().mockReturnValue(of(mockAi4eoscModules[0])),
            getModuleNomadConfiguration: jest
                .fn()
                .mockReturnValue(of(mockedModuleConfiguration)),
            getAi4lifeModules: jest
                .fn()
                .mockReturnValue(of(mockAi4lifeModules)),
        }));
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getModulesSummary should return a list of detailed modules', (done) => {
        const url = `${base}${endpoints.modulesSummary}`;

        service.getModulesSummary().subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(mockModuleSummaryList);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(mockModuleSummaryList);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getModulesSummary should return a list of detailed modules by tag', (done) => {
        const tag: TagObject = { tags: 'development' };
        const url = `${base}${endpoints.modulesSummary}?tags=` + tag.tags;

        service.getModulesSummary(tag).subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(mockModuleSummaryList[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(mockModuleSummaryList[0]);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getModule should return the metadata of a module', (done) => {
        const moduleName = 'test';
        const url = `${base}${endpoints.module.replace(':name', moduleName)}`;

        service.getModule(moduleName).subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(mockModuleSummaryList[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(mockModuleSummaryList[0]);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getModuleNomadConfiguration should return the nomad configuration for a module', (done) => {
        const moduleName = 'test';
        const url = `${base}${endpoints.moduleNomadConfiguration.replace(':name', moduleName)}?vo=vo.ai4eosc.eu`;

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

        const req = httpMock.expectOne(url);
        req.flush(mockedModuleConfiguration);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getModuleOscarConfiguration should return the oscar configuration for a module', (done) => {
        const moduleName = 'test';
        const url = `${base}${endpoints.moduleOscarConfiguration}?item_name=test&vo=vo.ai4eosc.eu`;

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

        const req = httpMock.expectOne(url);
        req.flush(mockedModuleConfiguration);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getAi4lifeModules should return mapped ai4life modules', (done) => {
        const url = endpoints.ai4lifeModulesSummary;

        service.getAi4lifeModules().subscribe((modules) => {
            try {
                expect(modules.length).toBe(2);
                expect(modules[0].id).toBe('philosophical-panda');
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(mockAi4lifeModules);
        expect(req.request.method).toBe('GET');
    });
});
