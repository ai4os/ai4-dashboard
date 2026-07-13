import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsContainerComponent } from './stats-container.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { COMMON_TEST_PROVIDERS } from '@testing/test-providers';

describe('StatsContainerComponent', () => {
    let component: StatsContainerComponent;
    let fixture: ComponentFixture<StatsContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatsContainerComponent],
            imports: [TranslatePipe, TranslateDirective, SharedModule],
            providers: [...COMMON_TEST_PROVIDERS],

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
