import { TestBed } from '@angular/core/testing';

import { ChatOverlayService } from './chat-overlay.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { of } from 'rxjs';
import { mockedUserProfile } from '@app/core/services/auth/user-profile.mock';

const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
    userProfileSubject: of({}),
    loadUserProfile: jest
        .fn()
        .mockReturnValue(Promise.resolve(mockedUserProfile)),
    login: jest.fn(),
    logout: jest.fn(),
};

describe('ChatOverlayService', () => {
    let service: ChatOverlayService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: AuthService, useValue: mockedAuthService }],
        }).compileComponents();
        service = TestBed.inject(ChatOverlayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
