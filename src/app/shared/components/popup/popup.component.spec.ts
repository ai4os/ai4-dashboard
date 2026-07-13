import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent } from './popup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { HtmlSanitizerService } from '@app/shared/services/html-sanitizer/html-sanitizer.service';
import { COMMON_TEST_PROVIDERS } from '@testing/test-providers';

const mockedHtmlSanitizerService: any = {
    getSanitizedText: jest.fn(),
};

describe('PopupComponent', () => {
    let component: PopupComponent;
    let fixture: ComponentFixture<PopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopupComponent],
            imports: [TranslatePipe, TranslateDirective, SharedModule],
            providers: [
                ...COMMON_TEST_PROVIDERS,
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
