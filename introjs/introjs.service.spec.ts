import { TestBed } from '@angular/core/testing';

import { IntroJSService } from './introjs.service';
import { AuthService } from '@app/core/services/auth/auth.service';

const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
};

describe('IntrojsService', () => {
    let service: IntroJSService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: AuthService, useValue: mockedAuthService }],
        });
        service = TestBed.inject(IntroJSService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
