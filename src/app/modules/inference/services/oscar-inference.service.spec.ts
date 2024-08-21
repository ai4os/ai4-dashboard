import { TestBed } from '@angular/core/testing';

import { OscarInferenceService } from './oscar-inference.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OscarInferenceService', () => {
    let service: OscarInferenceService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
        service = TestBed.inject(OscarInferenceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
