import { TestBed } from '@angular/core/testing';

import { ModulesService } from './modules.service';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { endpoints } from '@environments/endpoints';
import { module, modulesSummaryList } from './module.service.mock';
import { of } from 'rxjs';
import { TagObject } from '@app/data/types/tags';

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
