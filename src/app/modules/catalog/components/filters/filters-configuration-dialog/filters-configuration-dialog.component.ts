import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterGroup } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-filters-configuration-dialog',
    templateUrl: './filters-configuration-dialog.component.html',
    styleUrls: ['./filters-configuration-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
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
