import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';

import { UsageTabComponent } from './usage-tab.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { MatTabGroup } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedGlobalStats } from '@app/modules/statistics/services/stats/stats.service.mock';
import { mockedParsedUserProfile } from '@app/core/services/auth/auth-service.mock';
import { testProviders } from '@testing/test-providers';

describe('UsageTabComponent', () => {
    let component: UsageTabComponent;
    let fixture: ComponentFixture<UsageTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsageTabComponent, TranslatePipe, TranslateDirective],
            providers: [
                ...testProviders,
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(UsageTabComponent);
        component = fixture.componentInstance;
        component.userGlobalStats = mockedGlobalStats;
        component.userProfile = mockedParsedUserProfile.value;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show titles', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        let title = compiled.querySelector('#title')?.textContent;
        expect(title).toContain('USAGE');

        title = compiled.querySelector('#title-aggregate')?.textContent;
        expect(title).toContain('USERS-OVER-TIME');
    });

    it('should show tabs', fakeAsync(() => {
        const { debugElement } = fixture;

        const tabs = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'));

        expect(tabs.length).toBe(7);

        tabs.forEach((tab, index) => {
            tab.nativeElement.click();

            tick();
            fixture.detectChanges();

            checkSelectedIndex(index, fixture);

            const chart = debugElement.query(By.css('app-time-series-chart'));
            expect(chart).toBeTruthy();
        });
    }));

    it('should show stats container', () => {
        const statsContainer = fixture.debugElement.query(
            By.css('app-stats-container')
        );
        const instance = statsContainer.componentInstance;

        expect(instance).toBeTruthy();
        expect(instance.usedCpuNum).toBe(14);
        expect(instance.totalCpuNum).toBe(345);
        expect(instance.usedMemory).toBe(2);
        expect(instance.totalMemory).toBe(16);
        expect(instance.usedDisk).toBe(10);
        expect(instance.totalDisk).toBe(64);
        expect(instance.usedGpuNum).toBe(12);
        expect(instance.totalGpuNum).toBe(545);
        expect(instance.usedLabel).toBe('AI4EOSC Dashboard Test');
        expect(instance.freeLabel).toBe('Test AI4EOSC');
    });
});

function checkSelectedIndex(
    expectedIndex: number,
    fixture: ComponentFixture<any>
) {
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(MatTabGroup))
        .componentInstance as MatTabGroup;

    expect(tabGroup.selectedIndex).toBe(expectedIndex);

    const tabLabelElement = fixture.debugElement.query(
        By.css(`.mat-mdc-tab:nth-of-type(${expectedIndex + 1})`)
    ).nativeElement;

    expect(tabLabelElement.classList.contains('mdc-tab--active')).toBe(true);
}
