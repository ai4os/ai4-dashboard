import { TestBed } from '@angular/core/testing';

import { StatsService } from './stats.service';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { mockedClusterStats, mockedUserStats } from './stats.service.mock';
import { expect } from '@jest/globals';
import { provideHttpClient } from '@angular/common/http';

const mockedConfigService: any = {
    voName: 'vo.ai4eosc.eu',
};
const { base } = environment.api;

describe('StatsServiceService', () => {
    let service: StatsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });

        service = TestBed.inject(StatsService);
        httpMock = TestBed.inject(HttpTestingController);

        jest.mock('./stats.service', () => ({
            getUserStats: jest.fn().mockReturnValue(of(mockedUserStats)),
            getClusterStats: jest.fn().mockReturnValue(of(mockedClusterStats)),
        }));
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getUserStats should return the stats of the logged user', (done) => {
        const url = `${base}/deployments/stats/user?vo=vo.ai4eosc.eu`;

        service.getUserStats().subscribe((stats) => {
            try {
                expect(stats).toBe(mockedUserStats);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(mockedUserStats);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });

    it('getClusterStats should return the stats of the cluster', (done) => {
        const url = `${base}/deployments/stats/cluster?vo=vo.ai4eosc.eu`;

        service.getClusterStats().subscribe((stats) => {
            try {
                expect(stats).toBe(mockedClusterStats);
                done();
            } catch (error) {
                done(error);
            }
        });

        const req = httpMock.expectOne(url);
        req.flush(mockedClusterStats);
        httpMock.verify();
        expect(req.request.method).toBe('GET');
    });
});
