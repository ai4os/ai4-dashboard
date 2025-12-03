import { TestBed } from '@angular/core/testing';

import { ApisixService } from './apisix.service';

describe('ApisixService', () => {
    let service: ApisixService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ApisixService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
