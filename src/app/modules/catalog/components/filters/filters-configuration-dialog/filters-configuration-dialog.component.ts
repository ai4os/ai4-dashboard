import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogClose,
} from '@angular/material/dialog';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import { UiExpansionPanelComponent } from '@app/shared/components/ui/ui-expansion-panel/ui-expansion-panel.component';
import { UiChipComponent } from '@app/shared/components/ui/ui-chip/ui-chip.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-filters-configuration-dialog',
    templateUrl: './filters-configuration-dialog.component.html',
    styleUrls: ['./filters-configuration-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        UiCardComponent,
        UiExpansionPanelComponent,
        UiChipComponent,
        UiButtonComponent,
        MatIcon,
        MatDialogClose,
        TranslatePipe,
    ],
})
export class FiltersConfigurationDialogComponent {
    dialogRef =
        inject<MatDialogRef<FiltersConfigurationDialogComponent>>(MatDialogRef);
    filters = inject(MAT_DIALOG_DATA);

    deleteFilter(index: number) {
        this.filters.splice(index, 1);
        if (this.filters.length === 0) {
            this.dialogRef.close(this.filters);
        }
    }

    resetFilters() {
        this.filters = [];
        this.dialogRef.close(this.filters);
    }

    closeDialog(): void {
        this.dialogRef.close(false);
    }
}
