import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { Subject, of } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { By } from '@angular/platform-browser';
import { SharedModule } from '@app/shared/shared.module';
import { MatTabGroup } from '@angular/material/tabs';
import { StatsService } from '../../services/stats/stats.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
    mockedClusterStats,
    mockedUserStats,
} from '../../services/stats/stats.service.mock';
import { expect } from '@jest/globals';

const mockedConfigService: any = {};

const mockedProfile = {
    info: {
        exp: 1693908513,
        iat: 1693907913,
        auth_time: 1693907911,
        jti: '00000000-c9e1-44b7-b313-4bde8fba70fa',
        iss: 'https://aai-demo.egi.eu/auth/realms/egi',
        aud: 'ai4eosc-dashboard',
        sub: 'test@egi.eu',
        typ: 'ID',
        azp: 'ai4eosc-dashboard',
        nonce: 'WnVHR3ZpOVoyVlFwcjVGTEtIRWhyUTZ0eXJYVHZxN1M4TX5MRzVKWVJYVHZx',
        session_state: '00000000-818c-46d4-ad87-1b9a1c22c43f',
        at_hash: 'gdEA9VsgdEA9V-mubWhBWw',
        sid: 'b27a9b7a-818c-46d4-ad87-1b9a1818c43f',
        voperson_verified_email: ['test@ifca.unican.es'],
        email_verified: true,
        name: 'AI4EOSC Dasboard Test',
        preferred_username: 'ai4dash',
        eduperson_assurance: [
            'https://refeds.org/assurance/IAP/low',
            'https://aai.egi.eu/LoA#Low',
        ],
        given_name: 'AI4EOSC Dasboard ',
        family_name: 'Test',
        email: 'test@ifca.unican.es',
        eduperson_entitlement: [
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=vm_operator#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=vm_operator#aai.egi.eu',
        ],
    },
};

const mockedOAuthService = {
    configure: jest.fn().mockReturnValue(void 0),
    hasValidAccessToken: jest.fn().mockReturnValue(true),
    loadUserProfile: jest.fn().mockReturnValue(Promise.resolve(mockedProfile)),
    setupAutomaticSilentRefresh: jest.fn().mockReturnValue(void 0),
    events: of(Subject<OAuthEvent>),
};

const mockedMediaQueryList: MediaQueryList = {
    matches: true,
    media: 'test',
    onchange: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
};

const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

const mockedStatsService: any = {
    getUserStats: jest.fn().mockReturnValue(of(mockedUserStats)),
    getClusterStats: jest.fn().mockReturnValue(of(mockedClusterStats)),
};

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashboardComponent],
            imports: [
                HttpClientTestingModule,
                TranslateModule.forRoot(),
                SharedModule,
                BrowserAnimationsModule,
            ],
            providers: [
                AuthService,
                { provide: OAuthService, useValue: mockedOAuthService },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: StatsService, useValue: mockedStatsService },
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
        component.ngOnInit();

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
