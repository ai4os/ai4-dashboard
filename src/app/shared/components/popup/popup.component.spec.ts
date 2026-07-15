import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent } from './popup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { HtmlSanitizerService } from '@app/shared/services/html-sanitizer/html-sanitizer.service';
import { testProviders } from '@testing/test-providers';

const mockedHtmlSanitizerService: any = {
    getSanitizedText: jest.fn(),
};

describe('PopupComponent', () => {
    let component: PopupComponent;
    let fixture: ComponentFixture<PopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [],
            imports: [PopupComponent, TranslatePipe, TranslateDirective],
            providers: [
                ...testProviders,
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                {
                    provide: HtmlSanitizerService,
                    useValue: mockedHtmlSanitizerService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
