import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsListComponent } from './tools-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { mockedToolsService } from '@app/modules/catalog/services/tools-service/tools-service.mock';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';

describe('ToolsListComponent', () => {
    let component: ToolsListComponent;
    let fixture: ComponentFixture<ToolsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ToolsListComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: ToolsService, useValue: mockedToolsService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ToolsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load tools on init', () => {
        expect(mockedToolsService.getToolsSummary).toHaveBeenCalled();
        expect(component.tools.length).toBe(2);
        expect(component.toolsLoading).toBe(false);
    });
});
