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

@NgModule({
    declarations: [
        ConfirmationDialogComponent,
        CopyToClipboardDirective,
        PopupComponent,
        ChipWithIconComponent,
        DeploymentsTableComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        TranslateModule,
        RouterModule,
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
    ],
})
export class SharedModule {}
