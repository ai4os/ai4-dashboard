import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard-directive';

@NgModule({
    declarations: [ConfirmationDialogComponent, CopyToClipboardDirective],
    imports: [CommonModule, MaterialModule],
    exports: [
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        TranslateModule,
        BreadcrumbModule,
        CopyToClipboardDirective,
    ],
})
export class SharedModule {}
