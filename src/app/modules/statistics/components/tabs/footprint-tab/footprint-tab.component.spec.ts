import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintTabComponent } from './footprint-tab.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { COMMON_TEST_PROVIDERS } from '@testing/test-providers';

describe('FootprintTabComponent', () => {
    let component: FootprintTabComponent;
    let fixture: ComponentFixture<FootprintTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FootprintTabComponent],
            imports: [TranslatePipe, TranslateDirective],
            providers: [...COMMON_TEST_PROVIDERS],
        }).compileComponents();

        fixture = TestBed.createComponent(FootprintTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
