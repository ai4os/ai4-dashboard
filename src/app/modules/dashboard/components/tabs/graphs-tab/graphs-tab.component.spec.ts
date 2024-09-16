import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphsTabComponent } from './graphs-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabGroup } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { SharedModule } from '@app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { GlobalStats } from '@app/shared/interfaces/stats.interface';
import { UserProfile } from '@app/core/services/auth/auth.service';

const mockedConfigService: any = {
    projectName: 'TestAI4EOSC',
};

const mockedUserProfile: UserProfile = {
    name: 'Test',
    isAuthorized: true,
    isOperator: true,
    email: 'test@ifca.unican.es',
    eduperson_entitlement: [
        'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=member#aai.egi.eu',
        'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=vm_operator#aai.egi.eu',
        'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=member#aai.egi.eu',
        'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=vm_operator#aai.egi.eu',
    ],
};
const mockedUserStats: GlobalStats = {
    cpuNumAgg: 14,
    cpuNumTotal: 345,
    memoryMBAgg: 234,
    memoryMBTotal: 234234,
    diskMBAgg: 234,
    diskMBTotal: 2346,
    gpuNumAgg: 12,
    gpuNumTotal: 545,
};

describe('GraphsTabComponent', () => {
    let component: GraphsTabComponent;
    let fixture: ComponentFixture<GraphsTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GraphsTabComponent],
            imports: [
                TranslateModule.forRoot(),
                SharedModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(GraphsTabComponent);
        component = fixture.componentInstance;
        component.userGlobalStats = mockedUserStats;
        component.userProfile = mockedUserProfile;
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

    it('should show tabs', () => {
        const { debugElement } = fixture;
        let chart = debugElement.query(By.css('app-time-series-chart'));
        expect(chart).toBeTruthy();

        // first tab is selected
        let tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[0];
        tabLabel.nativeElement.click();
        checkSelectedIndex(0, fixture);
        chart = debugElement.query(By.css('app-time-series-chart'));
        expect(chart).toBeTruthy();

        // select the second tab
        tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[1];
        tabLabel.nativeElement.click();
        checkSelectedIndex(1, fixture);
        chart = debugElement.query(By.css('app-time-series-chart'));
        expect(chart).toBeTruthy();

        // select the third tab
        tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[2];
        tabLabel.nativeElement.click();
        checkSelectedIndex(2, fixture);
        chart = debugElement.query(By.css('app-time-series-chart'));
        expect(chart).toBeTruthy();

        // select the fourth tab
        tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[3];
        tabLabel.nativeElement.click();
        checkSelectedIndex(3, fixture);
        chart = debugElement.query(By.css('app-time-series-chart'));
        expect(chart).toBeTruthy();

        // select the fifth tab
        tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[4];
        tabLabel.nativeElement.click();
        checkSelectedIndex(4, fixture);
        chart = debugElement.query(By.css('app-time-series-chart'));
        expect(chart).toBeTruthy();

        // select the sixth tab
        tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[5];
        tabLabel.nativeElement.click();
        checkSelectedIndex(5, fixture);
        chart = debugElement.query(By.css('app-time-series-chart'));
        expect(chart).toBeTruthy();

        // select the seventh tab
        tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[6];
        tabLabel.nativeElement.click();
        checkSelectedIndex(6, fixture);
        chart = debugElement.query(By.css('app-time-series-chart'));
        expect(chart).toBeTruthy();
    });

    it('should show stats container', () => {
        const { debugElement } = fixture;
        const container = debugElement.query(By.css('app-stats-container'));
        expect(container).toBeTruthy();
        expect(container.properties.usedCpuNum).toBe(14);
        expect(container.properties.totalCpuNum).toBe(345);
        expect(container.properties.usedMemory).toBe(234);
        expect(container.properties.totalMemory).toBe(234234);
        expect(container.properties.usedDisk).toBe(234);
        expect(container.properties.totalDisk).toBe(2346);
        expect(container.properties.usedGpuNum).toBe(12);
        expect(container.properties.totalGpuNum).toBe(545);
        expect(container.properties.usedLabel).toBe('Test');
        expect(container.properties.freeLabel).toBe('TestAI4EOSC');
    });
});

/**
 * Checks that the `selectedIndex` has been updated; checks that the label and body have their
 * respective `active` classes
 */
function checkSelectedIndex(
    expectedIndex: number,
    fixture: ComponentFixture<any>
) {
    fixture.detectChanges();

    const tabComponent: MatTabGroup = fixture.debugElement.query(
        By.css('mat-tab-group')
    ).componentInstance;
    expect(tabComponent.selectedIndex).toBe(expectedIndex);

    const tabLabelElement = fixture.debugElement.query(
        By.css(`.mat-mdc-tab:nth-of-type(${expectedIndex + 1})`)
    ).nativeElement;
    expect(tabLabelElement.classList.contains('mdc-tab--active')).toBe(true);

    const tabContentElement = fixture.debugElement.query(
        By.css(`mat-tab-body:nth-of-type(${expectedIndex + 1})`)
    ).nativeElement;
    expect(
        tabContentElement.classList.contains('mat-mdc-tab-body-active')
    ).toBe(true);
}
