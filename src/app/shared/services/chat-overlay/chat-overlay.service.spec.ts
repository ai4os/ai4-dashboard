import { TestBed } from '@angular/core/testing';

import { ChatOverlayService } from './chat-overlay.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';

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
