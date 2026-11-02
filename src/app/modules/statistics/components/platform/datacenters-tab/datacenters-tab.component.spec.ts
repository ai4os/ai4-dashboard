jest.mock('ol-mapbox-style', () => ({ applyStyle: jest.fn() }));

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
    let originalFetch: typeof fetch | undefined;
    const fetchMock = jest.fn().mockResolvedValue({
        json: async () => ({ layers: [] }),
    });

    beforeEach(async () => {
        originalFetch = globalThis.fetch;
        Object.defineProperty(globalThis, 'fetch', {
            configurable: true,
            value: fetchMock,
        });

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

    afterEach(() => {
        Object.defineProperty(globalThis, 'fetch', {
            configurable: true,
            value: originalFetch,
        });
        fetchMock.mockClear();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('shows map', () => {
        const map = fixture.debugElement.query(By.css('#map'));
        expect(map).toBeTruthy();
    });
});
