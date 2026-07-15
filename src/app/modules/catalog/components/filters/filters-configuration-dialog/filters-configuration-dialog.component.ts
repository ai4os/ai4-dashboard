import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogClose,
} from '@angular/material/dialog';
import { FilterGroup } from '@app/shared/interfaces/module.interface';
import {
    MatCard,
    MatCardContent,
    MatCardActions,
} from '@angular/material/card';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { ChipWithIconComponent } from '../../../../../shared/components/chip-with-icon/chip-with-icon.component';
import { MatMiniFabButton, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-filters-configuration-dialog',
    templateUrl: './filters-configuration-dialog.component.html',
    styleUrls: ['./filters-configuration-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatCard,
        MatCardContent,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        ChipWithIconComponent,
        MatMiniFabButton,
        MatTooltip,
        MatIcon,
        MatCardActions,
        MatButton,
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
