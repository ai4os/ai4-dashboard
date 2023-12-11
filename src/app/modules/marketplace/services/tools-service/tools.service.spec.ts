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
                .mockReturnValue(of(toolsSummaryListMock)),
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
});
