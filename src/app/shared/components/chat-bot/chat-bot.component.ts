import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {
    ChatMessage,
    ChatRequest,
    ChatResponse,
} from '@app/shared/interfaces/chat.interface';
import { ChatBotService } from '@app/shared/services/chat-bot/chat-bot.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

@Component({
    selector: 'app-chat-bot',
    templateUrl: './chat-bot.component.html',
    styleUrl: './chat-bot.component.scss',
})
export class ChatBotComponent {
    constructor(
        private chatBotService: ChatBotService,
        private renderer: Renderer2,
        private snackbarService: SnackbarService,
        private sidenavService: SidenavService
    ) {}

    @ViewChild('messagesList') private messagesList!: ElementRef;

    protected open = false;
    protected expanded = false;
    protected isLoading = false;
    protected message: string = '';
    protected chatHistory: ChatRequest = {
        model: 'ai4eoscassistant',
        messages: [],
    };
    protected chatMargin = '350px';

    manageChat() {
        this.open = !this.open;
        if (this.open) {
            setTimeout(() => this.scrollToBottom(), 0);
        } else {
            this.expanded = false;
        }
    }

    sendMessage() {
        this.isLoading = true;

        let newMessage: ChatMessage = {
            role: 'user',
            content: this.message,
        };
        this.addMessage(newMessage);

        this.message = '';

        let request: ChatRequest = {
            model: 'ai4eoscassistant',
            messages: [],
        };

        if (this.chatHistory.messages.length === 0) {
            request.messages = [newMessage];
        } else {
            request.messages = this.chatHistory.messages;
        }

        this.chatBotService.requestResponse(request).subscribe({
            next: (response: ChatResponse) => {
                let message: ChatMessage = {
                    role: 'assistant',
                    content: response.choices[0].message.content,
                };
                this.isLoading = false;
                this.addMessage(message);
            },
            error: () => {
                this.isLoading = false;
                this.snackbarService.openError(
                    'Error connecting to the LLM, please try again later'
                );
            },
        });
    }

    addMessage(message: ChatMessage) {
        this.chatHistory.messages.push(message);
        setTimeout(() => this.scrollToBottom(), 0);
    }

    isQuestionEmpty(): boolean {
        return this.message.replace(/\s/g, '').length === 0;
    }

    scrollToBottom(): void {
        const element = this.messagesList?.nativeElement;
        if (element) {
            this.renderer.setProperty(
                element,
                'scrollTop',
                element.scrollHeight
            );
        }
    }

    resizeChat() {
        this.expanded = !this.expanded;
        if (this.sidenavService.isOpen()) {
            this.chatMargin = '350px';
        } else {
            this.chatMargin = '50px';
        }
    }
}
