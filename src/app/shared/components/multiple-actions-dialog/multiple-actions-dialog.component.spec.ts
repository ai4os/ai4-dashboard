import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleActionsDialogComponent } from './multiple-actions-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mockDialogRef } from '@app/shared/mocks/mat-dialog.mock';

describe('MultipleActionsDialogComponent', () => {
    let component: MultipleActionsDialogComponent;
    let fixture: ComponentFixture<MultipleActionsDialogComponent>;
    const mockedData = {
        title: 'Choose an option',
        optionA: 'Action A',
        optionB: 'Action B',
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MultipleActionsDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockedData },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MultipleActionsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should receive injected data', () => {
        expect(component.data).toEqual(mockedData);
    });

    it('should call dialogRef.close with optionA when onActionA is called', () => {
        component.onActionA();
        expect(mockDialogRef.close).toHaveBeenCalledWith('Action A');
    });

    it('should call dialogRef.close with optionB when onActionB is called', () => {
        component.onActionB();
        expect(mockDialogRef.close).toHaveBeenCalledWith('Action B');
    });
});
