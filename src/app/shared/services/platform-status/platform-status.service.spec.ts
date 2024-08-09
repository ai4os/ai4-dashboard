import { TestBed } from '@angular/core/testing';
import { PlatformStatusService } from './platform-status.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PlatformStatusService', () => {
    let service: PlatformStatusService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(PlatformStatusService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
