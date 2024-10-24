import { TestBed } from '@angular/core/testing';

import { OscarInferenceService } from './oscar-inference.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('OscarInferenceService', () => {
    let service: OscarInferenceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(OscarInferenceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
