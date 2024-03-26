import { TestBed } from '@angular/core/testing';

import { ModulesService } from './modules.service';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { endpoints } from '@environments/endpoints';
import { module, modulesSummaryList, accessToken } from './module.service.mock';
import { ClientMock, serviceOscar } from './oscar-module.mock';
import { of } from 'rxjs';
import { TagObject } from '@app/data/types/tags';
import { OAuthStorage } from 'angular-oauth2-oidc';

const { base } = environment.api;
const mockedConfigService: any = {
    voName: 'vo.ai4eosc.eu',
};

const moduleMock = module;
const modulesSummaryListMock = modulesSummaryList;

describe('ModulesService', () => {
    let service: ModulesService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                OAuthStorage,
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ModulesService);
        httpMock = TestBed.inject(HttpTestingController);
        jest.mock('./modules.service', () => ({
            getModulesSummary: jest
                .fn()
                .mockReturnValue(of(modulesSummaryListMock))
                .mockReturnValue(of(modulesSummaryListMock[0])),
            getModule: jest.fn().mockReturnValue(of(moduleMock)),
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
                expect(asyncData).toBe(modulesSummaryListMock);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(modulesSummaryListMock);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getModulesSummary should return a list of detailed modules by tag', (done) => {
        const tag: TagObject = { tags: 'development' };
        const url = `${base}${endpoints.modulesSummary}?tags=` + tag.tags;

        service.getModulesSummary(tag).subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(modulesSummaryListMock[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(modulesSummaryListMock[0]);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getModule should return the metadata of a module', (done) => {
        const moduleName = 'test';
        const url = `${base}${endpoints.module.replace(':name', moduleName)}`;

        service.getModule(moduleName).subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(moduleMock);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(moduleMock);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });
});

describe('Module oscar-js', () => {
    let service: ModulesService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
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

    it('should exist and valid access token', () => {
        jest.spyOn(service, 'getAccessToken').mockReturnValue(accessToken);
        const token = service.getAccessToken();
        expect(token).toBeDefined();
        expect(token).toBe('test-oidcToken');
    });

    it('should oscar client initialization', () => {
        const client = new ClientMock();
        expect(client).toBeDefined();
    });

    it('should list oscar services', () => {
        const client = new ClientMock();
        const services = client.getServices();
        expect(services).toBeInstanceOf(Array);
        expect(services).toHaveLength(2);
    });

    it('should oscar service created', async () => {
        const client = new ClientMock();
        const response = await client.createService(
            'oscar_endpoint',
            serviceOscar
        );
        expect(response).toBeDefined();
        expect(response).toHaveProperty('cluster_id');
        expect(response).toHaveProperty('token');
        expect(response).toHaveProperty('vo');
        expect(response).toHaveProperty('clusters');
    });

    it('should oscar service invoked', async () => {
        const client = new ClientMock();
        const response = await client.runService(
            'oscar_endpoint',
            'serviceName',
            'file'
        );
        expect(response).toBeDefined();
        expect(response).toHaveProperty('mime');
        expect(response).toHaveProperty('data');
    });

    it('should response with server info', async () => {
        const client = new ClientMock();
        expect(client.clusterInfo()).toBeDefined();

        const response = await client.clusterInfo();
        expect(response).toBeDefined();
        expect(response).toMatchObject({
            version: expect.any(String),
            git_commit: expect.any(String),
            architecture: expect.any(String),
            kubernetes_version: expect.any(String),
            serverless_backend: {
                name: expect.any(String),
                version: expect.any(String),
            },
        });
    });

    it('should response with server config', async () => {
        const client = new ClientMock();
        expect(client.clusterConfig()).toBeDefined();

        const response = await client.clusterConfig();
        expect(response).toBeDefined();
        expect(response).toMatchObject({
            name: expect.any(String),
            namespace: expect.any(String),
            services_namespace: expect.any(String),
            gpu_available: expect.any(Boolean),
            serverless_backend: expect.any(String),
        });
    });
});
