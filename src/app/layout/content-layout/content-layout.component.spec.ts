import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLayoutComponent } from './content-layout.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MaterialModule } from '@app/shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';

describe('ContentLayoutComponent', () => {
    let component: ContentLayoutComponent;
    let fixture: ComponentFixture<ContentLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                BrowserAnimationsModule,
                RouterModule.forRoot([]),
                TranslateModule.forRoot(),
            ],
            declarations: [
                ContentLayoutComponent,
                SidenavComponent,
                TopNavbarComponent,
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
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
