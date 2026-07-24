import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ai4eoscModuleDetailComponent } from './ai4eosc-module-detail.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { TopNavbarComponent } from '@app/layout/top-navbar/top-navbar.component';
import { ModulesService } from '../../../services/modules-service/modules.service';
import { ToolsService } from '../../../services/tools-service/tools.service';
import { MarkdownComponent } from 'ngx-markdown';
import { MediaMatcher } from '@angular/cdk/layout';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import {
    mockAi4eoscModules,
    mockedModulesService,
} from '@app/modules/catalog/services/modules-service/modules-service.mock';
import { mockedToolsService } from '@app/modules/catalog/services/tools-service/tools-service.mock';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { testProviders } from '@testing/test-providers';
import { BreadcrumbService } from 'xng-breadcrumb';

const mockedModule = mockAi4eoscModules[0];

describe('ModuleDetailComponent', () => {
    let component: Ai4eoscModuleDetailComponent;
    let fixture: ComponentFixture<Ai4eoscModuleDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [],
            imports: [
                Ai4eoscModuleDetailComponent,
                TopNavbarComponent,
                MarkdownComponent,
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [
                ...testProviders,

                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: ModulesService, useValue: mockedModulesService },
                { provide: ToolsService, useValue: mockedToolsService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                {
                    provide: BreadcrumbService,
                    useValue: {
                        set: jest.fn(),
                        get: jest.fn(),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4eoscModuleDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load module information correctly', () => {
        component.isTool = false;
        const spyGetModules = jest.spyOn(mockedModulesService, 'getModule');
        const spyGetTool = jest.spyOn(mockedToolsService, 'getTool');

        expect(spyGetModules).toHaveBeenCalledWith('test');
        expect(spyGetTool).toHaveBeenCalledTimes(0);
        expect(component.module).toMatchObject(mockedModule);
        expect(component.isLoading).toBe(false);
    });

    it('should load tool information correctly', () => {
        component.isTool = true;
        const spyGetTool = jest.spyOn(mockedToolsService, 'getTool');

        component.ngOnInit();

        expect(spyGetTool).toHaveBeenCalledWith('test');
        expect(component.module).toMatchObject(mockedModule);
        expect(component.isLoading).toBe(false);
    });
});
