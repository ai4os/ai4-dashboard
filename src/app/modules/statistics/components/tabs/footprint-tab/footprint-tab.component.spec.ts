import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintTabComponent } from './footprint-tab.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { testProviders } from '@testing/test-providers';

describe('FootprintTabComponent', () => {
    let component: FootprintTabComponent;
    let fixture: ComponentFixture<FootprintTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FootprintTabComponent, TranslatePipe, TranslateDirective],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(FootprintTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
