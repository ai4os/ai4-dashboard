import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersConfigurationDialogComponent } from './filters-configuration-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FiltersConfigurationDialogComponent', () => {
    let component: FiltersConfigurationDialogComponent;
    let fixture: ComponentFixture<FiltersConfigurationDialogComponent>;
    let dialogRefMock: { close: jest.Mock };

    beforeEach(async () => {
        dialogRefMock = {
            close: jest.fn(),
        };

        await TestBed.configureTestingModule({
            declarations: [FiltersConfigurationDialogComponent],
            imports: [
                SharedModule,
                NoopAnimationsModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: dialogRefMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FiltersConfigurationDialogComponent);
        component = fixture.componentInstance;
        component.filters = [
            {
                libraries: ['PyTorch'],
                tasks: ['Computer Vision'],
                categories: ['AI4 tools'],
                datatypes: ['image'],
                tags: ['deep learning'],
            },
        ];

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should delete a filter and keep dialog open if filters remain', () => {
        component.filters.push({
            libraries: [],
            tasks: [],
            categories: ['Another'],
            datatypes: [],
            tags: [],
        });
        component.deleteFilter(0);
        expect(component.filters.length).toBe(1);
        expect(dialogRefMock.close).not.toHaveBeenCalled();
    });

    it('should delete the last filter and close the dialog', () => {
        component.filters = [
            {
                libraries: [],
                tasks: [],
                categories: ['Only one'],
                datatypes: [],
                tags: [],
            },
        ];
        component.deleteFilter(0);
        expect(component.filters.length).toBe(0);
        expect(dialogRefMock.close).toHaveBeenCalledWith([]);
    });

    it('should reset all filters and close the dialog', () => {
        component.resetFilters();
        expect(component.filters).toEqual([]);
        expect(dialogRefMock.close).toHaveBeenCalledWith([]);
    });

    it('should close dialog with false on closeDialog()', () => {
        component.closeDialog();
        expect(dialogRefMock.close).toHaveBeenCalledWith(false);
    });
});
