import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';
import { mockedAuthService } from './core/services/auth/auth-service.mock';
import { mockedConfigService } from './core/services/app-config/app-config.mock';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { testProviders } from '@testing/test-providers';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot([]),
                AppComponent,
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [
                ...testProviders,
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it(`should have as title 'ai4-dashboard'`, () => {
        expect(component.title).toEqual('ai4-dashboard');
    });

    it('tracks changes to the highest effective role in the user profile', () => {
        localStorage.removeItem('accessLevel');
        component.userProfile = {
            sub: 'test-user',
            name: 'Test User',
            email: 'test@example.org',
            vos: [],
            roles: ['ap-u', 'ap-a'],
            isDeveloper: false,
            isProjectMember: true,
            isAuthorized: true,
            isAuthenticated: true,
        };

        component['checkUserRoles']();
        expect(localStorage.getItem('accessLevel')).toBe('ap-u');

        component.userProfile = {
            ...component.userProfile!,
            roles: ['ap-a'],
        };
        component['checkUserRoles']();
        expect(localStorage.getItem('accessLevel')).toBe('ap-a');
        localStorage.removeItem('accessLevel');
    });
});
