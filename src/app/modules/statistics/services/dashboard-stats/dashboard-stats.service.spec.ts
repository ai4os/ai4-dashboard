import { TestBed } from '@angular/core/testing';
import { DashboardStatsService } from './dashboard-stats.service';

describe('DashboardStatsService', () => {
    let service: DashboardStatsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DashboardStatsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
