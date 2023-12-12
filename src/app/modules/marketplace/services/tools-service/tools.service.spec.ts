import { TestBed } from '@angular/core/testing';

import { ToolsService } from './tools.service';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { toolsSummaryList } from './tools.service.mock';
import { TagObject } from '@app/data/types/tags';

const { base, endpoints } = environment.api;
const mockedConfigService: any = {};

const toolsSummaryListMock = toolsSummaryList;

describe('ToolsService', () => {
    let service: ToolsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ToolsService);
        httpMock = TestBed.inject(HttpTestingController);
        jest.mock('./tools.service', () => ({
            getToolsSummary: jest
                .fn()
                .mockReturnValue(of(toolsSummaryListMock))
                .mockReturnValue(of(toolsSummaryListMock[0])),
        }));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getToolsSummary should return a list of detailed tools', (done) => {
        const url = `${base}${endpoints.toolsSummary}`;

        service.getToolsSummary().subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(toolsSummaryListMock);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(toolsSummaryListMock);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getModulesSummary should return a list of detailed modules by tag', (done) => {
        const tag: TagObject = { tags: 'docker' };
        const url = `${base}${endpoints.toolsSummary}?tags=` + tag.tags;

        service.getToolsSummary(tag).subscribe((asyncData) => {
            try {
                expect(asyncData).toBe(toolsSummaryListMock[0]);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(toolsSummaryListMock[0]);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });
});
