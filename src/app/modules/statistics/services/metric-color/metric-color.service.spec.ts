import { TestBed } from '@angular/core/testing';

import { MetricColorService } from './metric-color.service';

describe('MetricColorService', () => {
    let service: MetricColorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MetricColorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
