import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyPopupComponent } from './api-key-popup.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { COMMON_TEST_PROVIDERS } from '@testing/test-providers';

describe('ApiKeyPopupComponent', () => {
    let component: ApiKeyPopupComponent;
    let fixture: ComponentFixture<ApiKeyPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApiKeyPopupComponent],
            imports: [TranslatePipe, TranslateDirective],
            providers: [
                ...COMMON_TEST_PROVIDERS,

                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ApiKeyPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
