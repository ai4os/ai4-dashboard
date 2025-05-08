import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthModuleConfig, OAuthService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { By } from '@angular/platform-browser';
import { SharedModule } from '@app/shared/shared.module';
import { MatTabGroup } from '@angular/material/tabs';
import { StatsService } from '../../services/stats/stats.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedAuthService } from '@app/shared/mocks/auth-service.mock';
import { mockedStatsService } from '@app/shared/mocks/stats.service.mock';
import { mockedOAuthModuleConfig } from '@app/shared/mocks/oauth.module.config.mock';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardComponent],
            imports: [
                TranslateModule.forRoot(),
                SharedModule,
                BrowserAnimationsModule,
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                AuthService,
                { provide: OAuthService, useValue: mockedAuthService },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: StatsService, useValue: mockedStatsService },
                {
                    provide: OAuthModuleConfig,
                    useValue: mockedOAuthModuleConfig,
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show title', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const title = compiled.querySelector('#title')?.textContent;

        expect(title).toContain('DASHBOARD');
    });

    it('should show tabs', () => {
        // first tab is selected
        checkSelectedIndex(0, fixture);

        // select the second tab
        let tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[1];
        tabLabel.nativeElement.click();
        checkSelectedIndex(1, fixture);

        // select the third tab
        tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[2];
        tabLabel.nativeElement.click();
        checkSelectedIndex(2, fixture);

        // select the fourth tab
        tabLabel = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'))[3];
        tabLabel.nativeElement.click();
        checkSelectedIndex(3, fixture);
    });

    it('should show message when stats are not available', () => {
        jest.spyOn(mockedStatsService, 'getClusterStats').mockImplementation(
            () => {
                return of(null);
            }
        );
        jest.spyOn(mockedStatsService, 'getUserStats').mockImplementation(
            () => {
                return of(null);
            }
        );
        const compiled = fixture.nativeElement as HTMLElement;
        component.ngOnInit();
        fixture.detectChanges();

        const message = compiled.querySelector('#error')?.textContent;
        expect(message).toContain('NO-DATA');
    });

    it('should show message when userstats are not available', () => {
        jest.spyOn(mockedStatsService, 'getUserStats').mockImplementation(
            () => {
                return of(null);
            }
        );
        const compiled = fixture.nativeElement as HTMLElement;
        component.ngOnInit();
        fixture.detectChanges();

        const message = compiled.querySelector('#error')?.textContent;
        expect(message).toContain('NO-DATA');
    });

    it('should show message when cluster stats are not available', () => {
        jest.spyOn(mockedStatsService, 'getClusterStats').mockImplementation(
            () => {
                return of(null);
            }
        );

        const compiled = fixture.nativeElement as HTMLElement;
        component.ngOnInit();
        fixture.detectChanges();

        const message = compiled.querySelector('#error')?.textContent;
        expect(message).toContain('NO-DATA');
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
