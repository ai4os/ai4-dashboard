import { TestBed } from '@angular/core/testing';

import { IntroJSService } from './introjs.service';

describe('IntrojsService', () => {
    let service: IntroJSService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IntroJSService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
