import { TestBed } from '@angular/core/testing';

import { OscarInferenceService } from './oscar-inference.service';

describe('OscarInferenceService', () => {
    let service: OscarInferenceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OscarInferenceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
