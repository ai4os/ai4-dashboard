import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('ConfirmationDialogComponent', () => {
    let component: ConfirmationDialogComponent;
    let fixture: ComponentFixture<ConfirmationDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatDialogModule],
            declarations: [ConfirmationDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: 'This is a test',
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmationDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show texts correctly', () => {
        const noMsg =
            fixture.debugElement.nativeElement.querySelector(
                '#noBtn'
            ).textContent;
        expect(noMsg).toEqual('No');

        const yesMsg =
            fixture.debugElement.nativeElement.querySelector(
                '#yesBtn'
            ).textContent;
        expect(yesMsg).toEqual('Yes');

        const msg = fixture.debugElement.query(By.css('p')).nativeElement
            .textContent;
        expect(msg).toEqual('This is a test');
    });
});
