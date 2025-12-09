import { TestBed } from '@angular/core/testing';

import { LlmApiKeysService } from './llm-api-keys.service';

describe('LlmApiKeysService', () => {
    let service: LlmApiKeysService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LlmApiKeysService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
