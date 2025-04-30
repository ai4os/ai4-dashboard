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
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedAuthService } from '@app/shared/mocks/auth-service.mock';
import { mockedModulesService } from '@app/shared/mocks/modules-service.mock';
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedSnackbarService } from '@app/shared/mocks/snackbar-service.mock';

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
                { provide: ModulesService, useValue: mockedModulesService },
                { provide: SnackbarService, useValue: mockedSnackbarService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModulesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    afterEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call getAi4eoscModules and getAi4lifeModules on init', () => {
        const getAi4eoscModulesSpy = jest.spyOn(
            mockedModulesService,
            'getModulesSummary'
        );
        const getAi4lifeModulesSpy = jest.spyOn(
            mockedModulesService,
            'getAi4lifeModules'
        );

        component.ngOnInit();

        expect(getAi4eoscModulesSpy).toHaveBeenCalled();
        expect(getAi4lifeModulesSpy).toHaveBeenCalled();
    });

    it('should load marketplace from sessionStorage and select correct tab', () => {
        sessionStorage.setItem(
            'selectedMarketplace',
            JSON.stringify('ai4life')
        );
        const selectTabSpy = jest.spyOn(component, 'selectTab');

        component.ngOnInit();

        expect(component.marketplaceName).toBe('ai4life');
        expect(selectTabSpy).toHaveBeenCalledWith(2);
    });

    it('should call snackbarService if marketplace is invalid', () => {
        sessionStorage.setItem('selectedMarketplace', 'invalid');
        component.ngOnInit();

        expect(mockedSnackbarService.openError).toHaveBeenCalledWith(
            'Marketplace could not be loaded. Please try again later.'
        );
    });

    it('should change marketplace and store it in sessionStorage on tab change', () => {
        const event = { tab: { textLabel: 'AI4LIFE' } } as any;
        component.selectMarketplace(event);

        expect(component.marketplaceName).toBe('ai4life');
        expect(sessionStorage.getItem('selectedMarketplace')).toBe('"ai4life"');
    });
});
