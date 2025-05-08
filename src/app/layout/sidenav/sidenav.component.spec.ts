import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@app/shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedAuthService } from '@app/shared/mocks/auth-service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { mockedSidenavService } from '@app/shared/mocks/sidenav.service.mock';

describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidenavComponent, TopNavbarComponent],
            imports: [
                TranslateModule.forRoot(),
                MaterialModule,
                BrowserAnimationsModule,
                RouterModule.forRoot([]),
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: SidenavService, useValue: mockedSidenavService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize properties correctly from services', () => {
        expect(component.projectName).toBe('Test AI4EOSC');
        expect(component.acknowledgments).toBe(
            'The test AI4EOSC dashboard is a service provided by CSIC'
        );
        expect(component.isAuthorized).toBe(true);
    });

    it('should call sidenavService.toggle on toggleSidenav()', () => {
        component.toggleSidenav();
        expect(mockedSidenavService.toggle).toHaveBeenCalled();
    });

    it('should store scrollTop in sessionStorage if on /catalog/modules', () => {
        const event = {
            target: {
                scrollTop: 120,
            },
        } as unknown as Event;

        // Simula la ruta actual
        Object.defineProperty(window, 'location', {
            value: { pathname: '/catalog/modules' },
            writable: true,
        });

        component.checkScroll(event);

        expect(sessionStorage.getItem('scrollTop')).toBe('120');
    });

    it('should reset scrollTop in sessionStorage if not in detail view', () => {
        const event = {
            target: {
                scrollTop: 0,
            },
        } as unknown as Event;

        Object.defineProperty(window, 'location', {
            value: { pathname: '/catalog/other' },
            writable: true,
        });

        component.checkScroll(event);

        expect(sessionStorage.getItem('scrollTop')).toBe('0');
    });

    it('should remove LLMS link if VO is vo.imagine-ai.eu', () => {
        component.catalogLinks = [
            { name: 'SIDENAV.LLMS', url: '/catalog/llms' },
            { name: 'SIDENAV.MODULES', url: '/catalog/modules' },
        ];
        mockedConfigService.voName = 'vo.imagine-ai.eu';

        component.ngOnInit();

        const hasLLM = component.catalogLinks.some(
            (link) => link.name === 'SIDENAV.LLMS'
        );
        expect(hasLLM).toBe(false);
    });
});
