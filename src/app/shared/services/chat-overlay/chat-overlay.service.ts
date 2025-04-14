import { Injectable } from '@angular/core';
import {
    GlobalPositionStrategy,
    Overlay,
    OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChatBotComponent } from '@app/shared/components/chat-bot/chat-bot.component';
import { AuthService } from '@app/core/services/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class ChatOverlayService {
    private overlayRef: OverlayRef;
    private positionStrategy: GlobalPositionStrategy;

    constructor(
        private overlay: Overlay,
        private authService: AuthService
    ) {
        this.positionStrategy = this.overlay
            .position()
            .global()
            .bottom('20px')
            .right('40px');

        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy,
            hasBackdrop: false,
            scrollStrategy: this.overlay.scrollStrategies.noop(),
        });
    }

    openChat() {
        if (this.authService.isAuthenticated()) {
            const chatPortal = new ComponentPortal(ChatBotComponent);
            this.overlayRef.attach(chatPortal);
        }
    }

    closeChat() {
        this.overlayRef.detach();
    }
}
