import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeModuleDetailComponent } from './ai4life-module-detail.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockAi4lifeModules } from '@app/modules/catalog/services/modules-service/modules-service.mock';

const mockedModule = mockAi4lifeModules[0];

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
    });

    beforeEach(() => {
        // Mock root
        const root = document.createElement('div');
        root.classList.add('root');
        root.setAttribute('id', 'root');
        document.body.appendChild(root);

        // Mock getComputedStyle
        window.getComputedStyle = jest
            .fn()
            .mockImplementation((el: Element) => {
                return {
                    getPropertyValue: (prop: string) => {
                        if (prop === '--primary') return '#123456';
                        return '';
                    },
                } as CSSStyleDeclaration;
            });

        fixture = TestBed.createComponent(Ai4lifeModuleDetailComponent);
        component = fixture.componentInstance;
        component.module = mockAi4lifeModules[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should validate correct DOI with doiIsValid()', () => {
        expect(component.doiIsValid()).toBe(true);
    });

    it('should invalidate incorrect DOI with doiIsValid()', () => {
        component.module.doi = 'invalid-doi';
        expect(component.doiIsValid()).toBe(false);
    });
});
