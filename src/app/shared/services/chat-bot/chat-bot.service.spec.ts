import { TestBed } from '@angular/core/testing';

import { ChatBotService } from './chat-bot.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ChatBotService', () => {
    let service: ChatBotService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(ChatBotService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
