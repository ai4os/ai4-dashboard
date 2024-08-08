import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';

import { TopNavbarComponent } from './top-navbar.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MediaMatcher } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuTrigger } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';

const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
    userProfileSubject: of({}),
    login: jest.fn(),
    logout: jest.fn(),
};

const mockedSidenavService: any = {
    toggle: jest.fn(),
    open: jest.fn(),
    close: jest.fn(),
    setSidenav: jest.fn(),
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

describe('TopNavbarComponent', () => {
    let component: TopNavbarComponent;
    let fixture: ComponentFixture<TopNavbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TopNavbarComponent],
            imports: [
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
            ],
            providers: [
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: SidenavService, useValue: mockedSidenavService },
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

    it('should create', () => {
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

    it('should open Menu correctly', () => {
        // component.menuenter();
        // expect(component.isMatMenuOpen).toBe(true);
    });

    it('closes the menu when clicking outside the dropdown menu', fakeAsync(() => {
        // // We start with an opened menu
        // component.isMatMenuOpen = true;
        // const menuTigger: MatMenuTrigger = fixture.debugElement
        //     .query(By.directive(MatMenuTrigger))
        //     .injector.get(MatMenuTrigger);
        // const buttonMenu: MatButton = fixture.debugElement
        //     .query(By.directive(MatButton))
        //     .injector.get(MatButton);
        // // Menu should not be open if entered button is true
        // component.enteredProfileButton = true;
        // component.menuLeave(menuTigger, buttonMenu);
        // tick(100);
        // expect(component.isMatMenuOpen).toBe(false);
        // // Close menu otherwise
        // component.enteredProfileButton = false;
        // component.menuLeave(menuTigger, buttonMenu);
        // tick(100);
        // expect(component.isMatMenuOpen).toBe(false);
        // expect(menuTigger.menuOpen).toBe(false);
    }));

    it('opens the menu when clicking over the menu', fakeAsync(() => {
        // const menuTigger: MatMenuTrigger = fixture.debugElement
        //     .query(By.directive(MatMenuTrigger))
        //     .injector.get(MatMenuTrigger);
        // // Menu is closed
        // component.isMatMenuOpen = true;
        // component.buttonEnter(menuTigger);
        // tick(100);
        // expect(component.enteredProfileButton).toBe(true);
        // //Menu is opened
        // component.isMatMenuOpen = false;
        // component.buttonEnter(menuTigger);
        // tick(100);
        // expect(component.enteredProfileButton).toBe(true);
        // expect(menuTigger.menuOpen).toBe(true);
    }));

    it('closes the menu when clicking over the menu', fakeAsync(() => {
        // const menuTigger: MatMenuTrigger = fixture.debugElement
        //     .query(By.directive(MatMenuTrigger))
        //     .injector.get(MatMenuTrigger);
        // const buttonMenu: MatButton = fixture.debugElement
        //     .query(By.directive(MatButton))
        //     .injector.get(MatButton);
        // // Menu is closed
        // component.isMatMenuOpen = false;
        // component.buttonLeave(menuTigger, buttonMenu);
        // tick(100);
        // expect(menuTigger.menuOpen).toBe(false);
        // //Menu is opened
        // component.isMatMenuOpen = true;
        // component.buttonLeave(menuTigger, buttonMenu);
        // tick(100);
        // expect(component.enteredProfileButton).toBe(false);
        // // Opened by hovering over the button AND the menu was in a closed state; Shouldn't open the menu
        // component.enteredProfileButton = true;
        // component.isMatMenuOpen = false;
        // component.buttonLeave(menuTigger, buttonMenu);
        // tick(100);
        // expect(menuTigger.menuOpen).toBe(false);
    }));

    it('should call sidenavService correctly', () => {
        const sidenavServiceSpy = jest.spyOn(mockedSidenavService, 'toggle');
        component.toggleSidenav();
        expect(sidenavServiceSpy).toHaveBeenCalledTimes(1);
    });
});
