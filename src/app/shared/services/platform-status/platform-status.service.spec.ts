import { TestBed } from '@angular/core/testing';
import { PlatformStatusService } from './platform-status.service';

describe('PlatformStatusService', () => {
    let service: PlatformStatusService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlatformStatusService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
