import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeModuleDetailComponent } from './ai4life-module-detail.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedConfigService: any = {};

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

describe('Ai4lifeModuleDetailComponent', () => {
    let component: Ai4lifeModuleDetailComponent;
    let fixture: ComponentFixture<Ai4lifeModuleDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4lifeModuleDetailComponent],
            imports: [
                RouterModule.forRoot([]),
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                SharedModule,
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4lifeModuleDetailComponent);
        component = fixture.componentInstance;
        component.module = {
            id: '',
            name: '',
            description: '',
            doi: '',
            created: '',
            covers: [],
            downloadCount: '',
            tags: [],
            license: '',
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
