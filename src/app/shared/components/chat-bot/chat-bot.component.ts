import {
    Component,
    ElementRef,
    Renderer2,
    ViewChild,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    ChatMessage,
    ChatRequest,
} from '@app/shared/interfaces/chat.interface';
import { ChatBotService } from '@app/shared/services/chat-bot/chat-bot.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
} from '@angular/material/card';
import { NgClass } from '@angular/common';
import { MatMiniFabButton, MatFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MarkdownComponent } from 'ngx-markdown';
import { MatFormField, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-chat-bot',
    templateUrl: './chat-bot.component.html',
    styleUrl: './chat-bot.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatCard,
        NgClass,
        MatCardHeader,
        MatCardTitle,
        MatMiniFabButton,
        MatTooltip,
        MatIcon,
        MatCardContent,
        MarkdownComponent,
        MatFormField,
        MatInput,
        FormsModule,
        MatFabButton,
        TranslatePipe,
    ],
})
export class ChatBotComponent {
    private chatBotService = inject(ChatBotService);
    private renderer = inject(Renderer2);
    private snackbarService = inject(SnackbarService);
    private sidenavService = inject(SidenavService);

    @ViewChild('messagesList') private messagesList!: ElementRef;

    open = false;
    expanded = false;
    isLoading = false;
    message = '';
    response = '';
    chatHistory: ChatRequest = {
        model: 'ai4eoscassistant',
        messages: [],
    };
    chatMargin = '350px';

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

        const newMessage: ChatMessage = {
            role: 'user',
            content: this.message,
        };
        this.addMessage(newMessage);

        this.message = '';
        this.response = '';

        const request: ChatRequest = {
            model: 'ai4eoscassistant',
            messages: [],
        };

        if (this.chatHistory.messages.length === 0) {
            request.messages = [newMessage];
        } else {
            request.messages = this.chatHistory.messages;
        }

        this.chatBotService.requestResponse(request).subscribe({
            next: (chunk: string) => {
                if (this.response === '') {
                    this.response += chunk;
                    const message: ChatMessage = {
                        role: 'assistant',
                        content: this.response,
                    };
                    this.addMessage(message);
                } else {
                    this.response += chunk;
                    this.chatHistory.messages[
                        this.chatHistory.messages.length - 1
                    ].content = this.response;
                    setTimeout(() => this.scrollToBottom(), 0);
                }
            },
            complete: () => {
                this.isLoading = false;
                this.response = '';
            },
            error: () => {
                this.response = '';
                this.isLoading = false;
                this.snackbarService.openError(
                    'Error connecting to the LLM, please try logging in and out'
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

    resetChat() {
        this.chatHistory.messages = [];
    }
}
