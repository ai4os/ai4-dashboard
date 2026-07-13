import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeDialogComponent } from './iframe-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { COMMON_TEST_PROVIDERS } from '@testing/test-providers';

describe('IframeDialogComponent', () => {
    let component: IframeDialogComponent;
    let fixture: ComponentFixture<IframeDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslatePipe, TranslateDirective],
            declarations: [IframeDialogComponent],
            providers: [
                ...COMMON_TEST_PROVIDERS,

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
