import { TestBed } from '@angular/core/testing';
import { PlatformStatusService } from './platform-status.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PlatformStatusService', () => {
    let service: PlatformStatusService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(PlatformStatusService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
