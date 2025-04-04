import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesListComponent } from './modules-list.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SharedModule } from '@app/shared/shared.module';
import { SearchAi4eoscPipe } from '../../../pipes/search-card-pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

const mockedConfigService: any = {};
const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
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

describe('ModulesListComponent', () => {
    let component: ModulesListComponent;
    let fixture: ComponentFixture<ModulesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModulesListComponent, SearchAi4eoscPipe],
            imports: [
                SharedModule,
                NoopAnimationsModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                OAuthStorage,
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModulesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
