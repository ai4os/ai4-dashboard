import { TestBed } from '@angular/core/testing';

import { LlmApiKeysService } from './llm-api-keys.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LlmApiKeysService', () => {
    let service: LlmApiKeysService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(LlmApiKeysService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
