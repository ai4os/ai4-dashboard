import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedAuthService } from '@app/shared/mocks/auth-service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { ProfileService } from '../../services/profile.service';
import { mockedProfileService } from '@app/shared/mocks/profile.service.mock';
import { SecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service';
import { mockedSecretsService } from '@app/shared/mocks/secrets.service.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedSnackbarService } from '@app/shared/mocks/snackbar-service.mock';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileComponent],
            imports: [SharedModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: ProfileService, useValue: mockedProfileService },
                { provide: SecretsService, useValue: mockedSecretsService },
                { provide: SnackbarService, useValue: mockedSnackbarService },
            ],
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
        const userProfile = {
            name: 'Test User',
            email: 'test@example.com',
            isAuthorized: true,
            eduperson_entitlement: ['vo.project:role=user'],
        };

        mockedAuthService.userProfileSubject.next(userProfile);

        expect(component.name).toBe('Test User');
        expect(component.email).toBe('test@example.com');
        expect(component.isAuthorized).toBe(true);
    });

    it('should parse VoInfo correctly', () => {
        const entitlement = ['vo.ai4eosc.eu:role=member'];

        component.getVoInfo(entitlement);

        expect(component['vos']).toEqual([
            { name: 'ai4eosc', roles: ['member'] },
        ]);
    });

    it('should call loginWithHuggingFace when starting Hugging Face login', () => {
        component.startLoginWithHuggingFace();

        expect(mockedProfileService.loginWithHuggingFace).toHaveBeenCalled();
    });

    it('should open documentation link in new tab', () => {
        const openSpy = jest.spyOn(window, 'open').mockImplementation();

        component.openCustomNextcloudDocumentationWeb();

        expect(openSpy).toHaveBeenCalledWith(
            'https://docs.ai4eosc.eu/en/latest/technical/howto-developers/storage-providers.html#nextcloud'
        );
    });

    it('should show success snackbar on successful credential deletion', () => {
        jest.spyOn(component.confirmationDialog, 'open').mockReturnValue({
            afterClosed: () => of(true),
        } as MatDialogRef<typeof component>);

        component.unsyncHuggingFace();

        expect(mockedSnackbarService.openSuccess).toHaveBeenCalledWith(
            'Successfully deleted Hugging Face token'
        );
    });
});
