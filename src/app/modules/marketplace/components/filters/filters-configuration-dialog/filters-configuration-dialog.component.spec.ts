import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersConfigurationDialogComponent } from './filters-configuration-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FiltersConfigurationDialogComponent', () => {
    let component: FiltersConfigurationDialogComponent;
    let fixture: ComponentFixture<FiltersConfigurationDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FiltersConfigurationDialogComponent],
            imports: [
                SharedModule,
                NoopAnimationsModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FiltersConfigurationDialogComponent);
        component = fixture.componentInstance;
        component.filters = [
            {
                libraries: [],
                tasks: [],
                categories: ['AI4 tools'],
                datatypes: [],
                tags: [],
            },
        ];

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
