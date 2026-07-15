import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatacentersTabComponent } from './datacenters-tab.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';
import { By } from '@angular/platform-browser';
import { CountryFlagPipe } from '@app/modules/statistics/pipes/country-flag.pipe';
import { testProviders } from '@testing/test-providers';

describe('DatacentersTabComponent', () => {
    let component: DatacentersTabComponent;
    let fixture: ComponentFixture<DatacentersTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DatacentersTabComponent,
                TranslatePipe,
                TranslateDirective,
                CountryFlagPipe,
            ],
            providers: [...testProviders],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DatacentersTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('shows map', () => {
        const map = fixture.debugElement.query(By.css('#map'));
        expect(map).toBeTruthy();
    });
});
