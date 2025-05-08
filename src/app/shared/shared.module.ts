import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard-directive';
import { PopupComponent } from './components/popup/popup/popup.component';
import { ChipWithIconComponent } from './components/chip-with-icon/chip-with-icon.component';
import { DeploymentsTableComponent } from './components/deployments-table/deployments-table.component';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { MarkdownModule } from 'ngx-markdown';
import { IframeDialogComponent } from './components/iframe-dialog/iframe-dialog.component';

@NgModule({
    declarations: [
        ConfirmationDialogComponent,
        CopyToClipboardDirective,
        PopupComponent,
        ChipWithIconComponent,
        DeploymentsTableComponent,
        ChatBotComponent,
        IframeDialogComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        TranslateModule,
        RouterModule,
        MarkdownModule.forChild(),
    ],
    exports: [
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        TranslateModule,
        BreadcrumbModule,
        CopyToClipboardDirective,
        ChipWithIconComponent,
        DeploymentsTableComponent,
        ChatBotComponent,
        IframeDialogComponent,
    ],
})
export class SharedModule {}
