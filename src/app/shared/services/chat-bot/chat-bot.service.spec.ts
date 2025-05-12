import { TestBed } from '@angular/core/testing';

import { ChatBotService } from './chat-bot.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { mockedAuthService } from '@app/shared/mocks/auth-service.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';

describe('ChatBotService', () => {
    let service: ChatBotService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: OAuthService, useValue: mockedAuthService },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ChatBotService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
