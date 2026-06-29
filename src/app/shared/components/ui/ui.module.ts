import { NgModule } from '@angular/core';
import { UiButtonComponent } from './ui-button/ui-button.component';
import { MaterialModule } from '@app/shared/material.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiLoaderComponent } from './ui-loader/ui-loader.component';
import { UiChipComponent } from './ui-chip/ui-chip.component';
import { UiTabsComponent } from './ui-tabs/ui-tabs.component';
import { UiListCardComponent } from './ui-list-card/ui-list-card.component';
import { UiCardComponent } from './ui-card/ui-card.component';
import { UiCredentialRowComponent } from './ui-credential-row/ui-credential-row.component';
import { UiSnackbarComponent } from './ui-snackbar/ui-snackbar.component';

@NgModule({
    declarations: [
        UiButtonComponent,
        UiLoaderComponent,
        UiChipComponent,
        UiTabsComponent,
        UiListCardComponent,
        UiCardComponent,
        UiCredentialRowComponent,
        UiSnackbarComponent,
    ],
    imports: [CommonModule, MaterialModule, TranslateModule],
    exports: [
        UiButtonComponent,
        UiLoaderComponent,
        UiChipComponent,
        UiTabsComponent,
        UiListCardComponent,
        UiCardComponent,
        UiCredentialRowComponent,
    ],
})
export class UiModule {}
