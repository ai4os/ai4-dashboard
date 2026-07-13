import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavbarComponent } from './top-navbar.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { SharedModule } from '@app/shared/shared.module';
import { By } from '@angular/platform-browser';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { mockedSidenavService } from '@app/shared/services/sidenav/sidenav.service.mock';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { COMMON_TEST_PROVIDERS } from '@testing/test-providers';

describe('TopNavbarComponent', () => {
    let component: TopNavbarComponent;
    let fixture: ComponentFixture<TopNavbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TopNavbarComponent],
            imports: [
                SharedModule,
                RouterModule.forRoot([]),
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [
                ...COMMON_TEST_PROVIDERS,
                { provide: AuthService, useValue: mockedAuthService },
                { provide: SidenavService, useValue: mockedSidenavService },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(TopNavbarComponent);
        component = fixture.componentInstance;
        mockedAuthService.isAuthenticated = jest.fn().mockReturnValue(true);
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
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

        it('should show the login/register button', () => {
            const loginBtn = fixture.debugElement.query(
                By.css('.top-navbar__login-btn')
            );

            expect(loginBtn).toBeTruthy();
            expect(loginBtn.properties['matMenuTriggerFor']).toBeFalsy();
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

        it('should show the profile menu button instead of login', () => {
            const loginBtn = fixture.debugElement.query(
                By.css('.top-navbar__login-btn')
            );

            expect(loginBtn).toBeTruthy();
            expect(loginBtn.properties['text']).not.toBe(
                'TOP-NAVBAR.LOGIN-REGISTER'
            );
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should login correctly using current pathname', () => {
        const loginSpy = jest.spyOn(mockedAuthService, 'login');
        component.login();
        expect(loginSpy).toHaveBeenCalledWith(window.location.pathname);
    });

    it('should logout correctly', () => {
        const logoutSpy = jest.spyOn(mockedAuthService, 'logout');
        component.logout();
        expect(logoutSpy).toHaveBeenCalled();
    });

    it('should call sidenavService correctly', () => {
        const sidenavServiceSpy = jest.spyOn(mockedSidenavService, 'toggle');
        component.toggleSidenav();
        expect(sidenavServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should initialize voName correctly from appConfigService', () => {
        expect(component.voName).toEqual(mockedConfigService.voName);
    });

    it('should reflect isAuthorized from the userProfile signal', () => {
        const profile = {
            name: 'Test User',
            email: 'test@example.com',
            isAuthorized: true,
        };

        mockedAuthService.userProfileSubject.next(profile);
        fixture.detectChanges();

        expect(component.isAuthorized()).toBe(true);
    });

    it('should return false from isAuthorized when there is no profile', () => {
        mockedAuthService.userProfileSubject.next(null);
        fixture.detectChanges();

        expect(component.isAuthorized()).toBe(false);
    });

    it('should reflect isLoggedIn from authService.isAuthenticated', () => {
        mockedAuthService.isAuthenticated = jest.fn().mockReturnValue(true);
        expect(component.isLoggedIn()).toBe(true);

        mockedAuthService.isAuthenticated = jest.fn().mockReturnValue(false);
        expect(component.isLoggedIn()).toBe(false);
    });
});
