import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLayoutComponent } from './content-layout.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { RouterModule } from '@angular/router';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { testProviders } from '@testing/test-providers';

describe('ContentLayoutComponent', () => {
    let component: ContentLayoutComponent;
    let fixture: ComponentFixture<ContentLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ContentLayoutComponent,
                SidenavComponent,
                TopNavbarComponent,
                RouterModule.forRoot([]),
                TranslatePipe,
                TranslateDirective,
            ],

            providers: [
                ...testProviders,
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
