import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyPopupComponent } from './api-key-popup.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { testProviders } from '@testing/test-providers';

describe('ApiKeyPopupComponent', () => {
    let component: ApiKeyPopupComponent;
    let fixture: ComponentFixture<ApiKeyPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApiKeyPopupComponent, TranslatePipe, TranslateDirective],
            providers: [
                ...testProviders,
                { provide: MatDialogRef, useValue: { close: jest.fn() } },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        key: '123456789abcdef',
                    },
                },
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
