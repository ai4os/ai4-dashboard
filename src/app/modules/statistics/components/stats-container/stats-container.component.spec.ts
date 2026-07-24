import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsContainerComponent } from './stats-container.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testProviders } from '@testing/test-providers';

describe('StatsContainerComponent', () => {
    let component: StatsContainerComponent;
    let fixture: ComponentFixture<StatsContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                StatsContainerComponent,
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [...testProviders],

            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(StatsContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
