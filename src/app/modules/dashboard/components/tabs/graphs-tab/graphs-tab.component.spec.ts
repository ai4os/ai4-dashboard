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
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { of, Subject } from 'rxjs';

const mockedConfigService: any = {};

const mockedUserProfile: UserProfile = {
    name: 'Test',
    isAuthorized: true,
    isOperator: true,
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

    // it('should show title', () => {
    //     const compiled = fixture.nativeElement as HTMLElement;
    //     const title = compiled.querySelector('#title')?.textContent;
    //     expect(title).toContain('USAGE');
    // });

    // it('should show tabs', () => {
    //     // first tab is selected
    //     let tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[0];
    //     tabLabel.nativeElement.click();
    //     checkSelectedIndex(0, fixture);

    //     // select the second tab
    //     tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[1];
    //     tabLabel.nativeElement.click();
    //     checkSelectedIndex(1, fixture);

    //     // select the third tab
    //     tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[2];
    //     tabLabel.nativeElement.click();
    //     checkSelectedIndex(2, fixture);

    //     // select the fourth tab
    //     tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[3];
    //     tabLabel.nativeElement.click();
    //     checkSelectedIndex(3, fixture);

    //     // select the fifth tab
    //     tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[4];
    //     tabLabel.nativeElement.click();
    //     checkSelectedIndex(4, fixture);

    //     // select the sixth tab
    //     tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[5];
    //     tabLabel.nativeElement.click();
    //     checkSelectedIndex(5, fixture);

    //     // select the seventh tab
    //     tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[6];
    //     tabLabel.nativeElement.click();
    //     checkSelectedIndex(6, fixture);
    // });
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
