import { TestBed } from '@angular/core/testing';

import { StatsService } from './stats-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedConfigService: any = {};

describe('StatsServiceService', () => {
    let service: StatsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(StatsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
