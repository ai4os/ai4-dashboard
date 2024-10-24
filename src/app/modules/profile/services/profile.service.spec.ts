import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProfileService', () => {
    let service: ProfileService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(ProfileService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
