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

@NgModule({
    declarations: [
        ConfirmationDialogComponent,
        CopyToClipboardDirective,
        PopupComponent,
        ChipWithIconComponent,
    ],
    imports: [CommonModule, MaterialModule, FormsModule, TranslateModule],
    exports: [
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        TranslateModule,
        BreadcrumbModule,
        CopyToClipboardDirective,
        ChipWithIconComponent,
    ],
})
export class SharedModule {}
