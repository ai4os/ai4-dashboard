import { TestBed } from '@angular/core/testing';

import { ToolsService } from './tools.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { TagObject } from '@app/data/types/tags';
import { provideHttpClient } from '@angular/common/http';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import {
    mockAi4eoscModules,
    mockedModuleConfiguration,
} from '@app/shared/mocks/modules-service.mock';
import {
    mockAi4LifeLoaderToolConfiguration,
    mockedCvatConfiguration,
    mockedFedServerConfiguration,
    mockedVllmsConfig,
    mockedYamlVllmsConfig,
    mockLlmToolConfiguration,
    mockNvflareToolConfiguration,
    mockTools,
} from '@app/shared/mocks/tools-service.mock';

const { base, endpoints } = environment.api;

describe('ToolsService', () => {
    let service: ToolsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ToolsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getToolsSummary should return a list of detailed tools', (done) => {
        const expectedUrl = `${base}${endpoints.toolsSummary}`;

        service.getToolsSummary().subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(mockTools);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.keys().length === 0
        );

        req.flush(mockTools);
    });

    it('getModulesSummary should return a list of detailed modules by tag', (done) => {
        const tag: TagObject = { tags: 'docker' };
        const expectedUrl = `${base}${endpoints.toolsSummary}`;

        service.getToolsSummary(tag).subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(mockTools[0]);
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

        req.flush(mockTools[0]);
    });

    it('getTool should return the tool metadata', (done) => {
        const toolName = 'example-tool';
        const expectedUrl = `${base}${endpoints.tool.replace(':name', toolName)}`;

        service.getTool(toolName).subscribe((data) => {
            try {
                expect(data).toEqual(mockAi4eoscModules[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) => r.method === 'GET' && r.url === expectedUrl
        );

        req.flush(mockAi4eoscModules[0]);
    });

    it('getDevEnvConfiguration should return development env configuration', (done) => {
        const toolName = 'dev-tool';
        const expectedUrl = `${base}${endpoints.toolConfiguration.replace(':name', toolName)}`;

        service.getDevEnvConfiguration(toolName).subscribe((data) => {
            try {
                expect(data).toEqual(mockedModuleConfiguration);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('vo') === mockedConfigService.voName
        );

        req.flush(mockedModuleConfiguration);
    });

    it('getFederatedServerConfiguration should return configuration', (done) => {
        const toolName = 'federated-tool';
        const expectedUrl = `${base}${endpoints.toolConfiguration.replace(':name', toolName)}`;

        service.getFederatedServerConfiguration(toolName).subscribe((data) => {
            try {
                expect(data).toEqual(mockedFedServerConfiguration);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('vo') === mockedConfigService.voName
        );

        req.flush(mockedFedServerConfiguration);
    });

    it('getCvatConfiguration should return configuration', (done) => {
        const toolName = 'cvat-tool';
        const expectedUrl = `${base}${endpoints.toolConfiguration.replace(':name', toolName)}`;

        service.getCvatConfiguration(toolName).subscribe((data) => {
            try {
                expect(data).toEqual(mockedCvatConfiguration);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('vo') === mockedConfigService.voName
        );

        req.flush(mockedCvatConfiguration);
    });

    it('getAi4LifeConfiguration should return configuration', (done) => {
        const toolName = 'ai4life-tool';
        const expectedUrl = `${base}${endpoints.toolConfiguration.replace(':name', toolName)}`;

        service.getAi4LifeConfiguration(toolName).subscribe((data) => {
            try {
                expect(data).toEqual(mockAi4LifeLoaderToolConfiguration);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('vo') === mockedConfigService.voName
        );

        req.flush(mockAi4LifeLoaderToolConfiguration);
    });

    it('getVllmConfiguration should return configuration', (done) => {
        const toolName = 'vllm-tool';
        const expectedUrl = `${base}${endpoints.toolConfiguration.replace(':name', toolName)}`;

        service.getVllmConfiguration(toolName).subscribe((data) => {
            try {
                expect(data).toEqual(mockLlmToolConfiguration);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('vo') === mockedConfigService.voName
        );

        req.flush(mockLlmToolConfiguration);
    });

    it('getNvflareConfiguration should return configuration', (done) => {
        const toolName = 'nvflare-tool';
        const expectedUrl = `${base}${endpoints.toolConfiguration.replace(':name', toolName)}`;

        service.getNvflareConfiguration(toolName).subscribe((data) => {
            try {
                expect(data).toEqual(mockNvflareToolConfiguration);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) =>
                r.method === 'GET' &&
                r.url === expectedUrl &&
                r.params.get('vo') === mockedConfigService.voName
        );

        req.flush(mockNvflareToolConfiguration);
    });

    it('getVllmModelConfiguration should parse YAML and return models', (done) => {
        const expectedUrl =
            'https://raw.githubusercontent.com/ai4os/ai4-papi/refs/heads/master/etc/vllm.yaml';

        service.getVllmModelConfiguration().subscribe((data) => {
            try {
                expect(data).toEqual(mockedVllmsConfig);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(
            (r) => r.method === 'GET' && r.url === expectedUrl
        );

        req.flush(mockedYamlVllmsConfig);
    });
});
