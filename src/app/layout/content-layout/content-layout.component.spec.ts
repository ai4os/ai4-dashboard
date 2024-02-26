import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLayoutComponent } from './content-layout.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MaterialModule } from '@app/shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
    userProfileSubject: of({}),
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

const mockedConfigService: any = {};

describe('ContentLayoutComponent', () => {
    let component: ContentLayoutComponent;
    let fixture: ComponentFixture<ContentLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                MaterialModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                TranslateModule.forRoot(),
            ],
            declarations: [
                ContentLayoutComponent,
                SidenavComponent,
                TopNavbarComponent,
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ContentLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
