import { NgModule } from '@angular/core';
import { UiButtonComponent } from './ui-button/ui-button.component';
import { MaterialModule } from '@app/shared/material.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiLoaderComponent } from './ui-loader/ui-loader.component';
import { UiChipComponent } from './ui-chip/ui-chip.component';
import { UiTabsComponent } from './ui-tabs/ui-tabs.component';
import { UiListCardComponent } from './ui-list-card/ui-list-card.component';

@NgModule({
    declarations: [
        UiButtonComponent,
        UiLoaderComponent,
        UiChipComponent,
        UiTabsComponent,
        UiListCardComponent,
    ],
    imports: [CommonModule, MaterialModule, TranslateModule],
    exports: [
        UiButtonComponent,
        UiLoaderComponent,
        UiChipComponent,
        UiTabsComponent,
        UiListCardComponent,
    ],
})
export class UiModule {}
