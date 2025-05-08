import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeDialogComponent } from './iframe-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('IframeDialogComponent', () => {
    let component: IframeDialogComponent;
    let fixture: ComponentFixture<IframeDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [IframeDialogComponent],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: { url: 'https://example.com' },
                },
                { provide: MatDialogRef, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(IframeDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
