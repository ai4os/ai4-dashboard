import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import { ChatBotComponent } from './chat-bot.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';

import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { mockedSidenavService } from '@app/shared/services/sidenav/sidenav.service.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedSnackbarService } from '@app/shared/services/snackbar/snackbar-service.mock';
import { throwError } from 'rxjs';
import { ChatBotService } from '@app/shared/services/chat-bot/chat-bot.service';
import { mockedChatBotService } from '@app/shared/services/chat-bot/chat-bot.service.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';

describe('ChatBotComponent', () => {
    let component: ChatBotComponent;
    let fixture: ComponentFixture<ChatBotComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatBotComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: OAuthService, useValue: mockedAuthService },
                { provide: SidenavService, useValue: mockedSidenavService },
                { provide: SnackbarService, useValue: mockedSnackbarService },
                { provide: ChatBotService, useValue: mockedChatBotService },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatBotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle open in manageChat', fakeAsync(() => {
        component.open = false;
        const scrollSpy = jest.spyOn(component as any, 'scrollToBottom');
        component.manageChat();
        expect(component.open).toBe(true);
        tick(100);
        expect(scrollSpy).toHaveBeenCalled();

        component.manageChat();
        expect(component.open).toBe(false);
        expect(component.expanded).toBe(false);
    }));

    it('should add a message and scroll', fakeAsync(() => {
        const scrollSpy = jest.spyOn(component as any, 'scrollToBottom');
        const msg = { role: 'user', content: 'hello' };
        component.addMessage(msg);
        expect(component.chatHistory.messages).toContainEqual(msg);
        tick(100);
        expect(scrollSpy).toHaveBeenCalled();
    }));

    it('isQuestionEmpty should return true for empty or whitespace message', () => {
        component.message = '   ';
        expect(component.isQuestionEmpty()).toBe(true);

        component.message = 'not empty';
        expect(component.isQuestionEmpty()).toBe(false);
    });

    it('should handle sendMessage success response', fakeAsync(() => {
        component.message = 'hello';

        const scrollSpy = jest.spyOn(component as any, 'scrollToBottom');

        component.sendMessage();

        tick(100);

        expect(component.chatHistory.messages.length).toBe(2); // user message + assistant message
        expect(component.isLoading).toBe(false);
        expect(scrollSpy).toHaveBeenCalled();
    }));

    it('should handle sendMessage error response', fakeAsync(() => {
        component.message = 'hello';
        mockedChatBotService.requestResponse.mockReturnValue(
            throwError(() => new Error('fail'))
        );

        component.sendMessage();
        tick(100);

        expect(mockedSnackbarService.openError).toHaveBeenCalledWith(
            'Error connecting to the LLM, please try again later'
        );
        expect(component.isLoading).toBe(false);
        expect(component.response).toBe('');
    }));

    it('resetChat should clear chatHistory', () => {
        component.chatHistory.messages = [
            { role: 'user', content: 'Hi' },
            { role: 'assistant', content: 'Hello' },
        ];
        component.resetChat();
        expect(component.chatHistory.messages.length).toBe(0);
    });
});
