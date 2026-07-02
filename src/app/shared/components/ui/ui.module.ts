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
import { UiTableComponent } from './ui-table/ui-table.component';
import { UiTextFieldComponent } from './ui-text-field/ui-text-field.component';
import { UiDatePickerComponent } from './ui-date-picker/ui-date-picker.component';
import { UiTableCellDirective } from '@app/shared/directives/ui-table-cell.directive';
import { UiExpansionPanelComponent } from './ui-expansion-panel/ui-expansion-panel.component';
import { UiSelectComponent } from './ui-select/ui-select.component';

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
        UiTableComponent,
        UiTextFieldComponent,
        UiDatePickerComponent,
        UiTableCellDirective,
        UiExpansionPanelComponent,
        UiSelectComponent,
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
        UiSnackbarComponent,
        UiTableComponent,
        UiTextFieldComponent,
        UiDatePickerComponent,
        UiTableCellDirective,
        UiExpansionPanelComponent,
        UiSelectComponent,
    ],
})
export class UiModule {}
