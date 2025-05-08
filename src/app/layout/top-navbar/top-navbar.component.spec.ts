import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { TopNavbarComponent } from './top-navbar.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedAuthService } from '@app/shared/mocks/auth-service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedSidenavService } from '@app/shared/mocks/sidenav.service.mock';

describe('TopNavbarComponent', () => {
    let component: TopNavbarComponent;
    let fixture: ComponentFixture<TopNavbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TopNavbarComponent],
            imports: [
                SharedModule,
                RouterModule.forRoot([]),
                TranslateModule.forRoot(),
                NoopAnimationsModule,
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: SidenavService, useValue: mockedSidenavService },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TopNavbarComponent);
        component = fixture.componentInstance;
        mockedAuthService.isAuthenticated = jest.fn().mockReturnValue(true);
        fixture.detectChanges();
    });

    describe('TopNavbarComponent When LoggedOut', () => {
        beforeEach(() => {
            mockedAuthService.isAuthenticated = jest
                .fn()
                .mockReturnValue(false);
            fixture.detectChanges();
        });
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should show login-register button', () => {
            expect(
                fixture.debugElement.query(By.css('.profile-button'))
            ).toBeNull();
            expect(
                fixture.debugElement.query(By.css('#showLoginButton'))
            ).toBeTruthy();
        });
    });

    describe('TopNavbarComponent When LoggedIn', () => {
        beforeEach(() => {
            mockedAuthService.isAuthenticated = jest.fn().mockReturnValue(true);
            fixture.detectChanges();
        });

        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should show logged-in menu', () => {
            expect(
                fixture.debugElement.query(By.css('#showLoginButton'))
            ).toBeNull();
            expect(
                fixture.debugElement.query(By.css('.profile-button'))
            ).toBeTruthy();
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should login correctly', fakeAsync(() => {
        component.login();
        const loginSpy = jest.spyOn(mockedAuthService, 'login');
        expect(loginSpy).toHaveBeenCalled();
    }));

    it('should logout correctly', fakeAsync(() => {
        component.logout();
        const loginSpy = jest.spyOn(mockedAuthService, 'logout');
        expect(loginSpy).toHaveBeenCalled();
    }));

    it('should call sidenavService correctly', () => {
        const sidenavServiceSpy = jest.spyOn(mockedSidenavService, 'toggle');
        component.toggleSidenav();
        expect(sidenavServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should have media queries correctly initialized', () => {
        expect(component.hideSidebarQuery).toBeDefined();
        expect(component.mobileQuery).toBeDefined();
        expect(mockedMediaMatcher.matchMedia).toHaveBeenCalledWith(
            '(max-width: 1366px)'
        );
        expect(mockedMediaMatcher.matchMedia).toHaveBeenCalledWith(
            '(max-width: 600px)'
        );
    });

    it('should initialize voName correctly from appConfigService', () => {
        expect(component.voName).toEqual(mockedConfigService.voName);
    });

    it('should update userProfile on authService userProfileSubject change', () => {
        const profile = {
            name: 'Test User',
            email: 'test@example.com',
            isAuthorized: true,
            isOperator: false,
            eduperson_entitlement: ['role1', 'role2'],
        };

        mockedAuthService.userProfileSubject.next(profile);

        expect(component.userProfile).toEqual(profile);
    });
});
