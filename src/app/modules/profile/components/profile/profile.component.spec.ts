import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { testProviders } from '@testing/test-providers';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileComponent, TranslatePipe, TranslateDirective],
            providers: [
                ...testProviders,

                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MatDialog, useValue: {} },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load user profile on init', () => {
        expect(component.name).toBe('AI4EOSC Dashboard Test');
        expect(component.email).toBe('test@ifca.unican.es');
        expect(component.isAuthorized).toBe(true);
        expect(component.isProjectMember).toBe(true);
    });

    it('should parse VoInfo correctly', () => {
        expect(component['vos']).toEqual([
            { name: 'vo.ai4eosc.eu', roles: ['ap-d', 'ap-u', 'ap-a'] },
            { name: 'vo.imagine-ai.eu', roles: ['ap-d'] },
        ]);
    });

    it('should update activeTab on onTabSelected', () => {
        component.onTabSelected('apikeys');
        expect(component.activeTab).toBe('apikeys');
    });

    it('should disable apikeys tab when not authorized', () => {
        component.isAuthorized = false;
        const apiKeysTab = component.tabs.find((t) => t.id === 'apikeys');
        expect(apiKeysTab?.disabled).toBe(true);
    });

    it('should enable apikeys tab when authorized', () => {
        component.isAuthorized = true;
        const apiKeysTab = component.tabs.find((t) => t.id === 'apikeys');
        expect(apiKeysTab?.disabled).toBe(false);
    });

    it('should disable storage tab when not a project member', () => {
        component.isProjectMember = false;
        const storageTab = component.tabs.find((t) => t.id === 'storage');
        expect(storageTab?.disabled).toBe(true);
    });
});
