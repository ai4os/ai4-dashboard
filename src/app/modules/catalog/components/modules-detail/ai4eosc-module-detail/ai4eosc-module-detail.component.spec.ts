import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ai4eoscModuleDetailComponent } from './ai4eosc-module-detail.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TopNavbarComponent } from '@app/layout/top-navbar/top-navbar.component';
import { ModulesService } from '../../../services/modules-service/modules.service';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from '../../../services/tools-service/tools.service';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { of } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedAuthService } from '@app/shared/mocks/auth-service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import {
    mockAi4eoscModules,
    mockedModulesService,
} from '@app/shared/mocks/modules-service.mock';
import { mockedMarkdownService } from '@app/shared/mocks/markdown-service.mock';
import { mockedToolsService } from '@app/shared/mocks/tools-service.mock';

const mockedModule = mockAi4eoscModules[0];

describe('ModuleDetailComponent', () => {
    let component: Ai4eoscModuleDetailComponent;
    let fixture: ComponentFixture<Ai4eoscModuleDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4eoscModuleDetailComponent, TopNavbarComponent],
            imports: [
                MarkdownComponent,
                SharedModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: ModulesService, useValue: mockedModulesService },
                { provide: ToolsService, useValue: mockedToolsService },
                { provide: MarkdownService, useValue: mockedMarkdownService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({
                            id: 'test',
                        }),
                        snapshot: {
                            paramMap: {
                                get: () => 'test', // represents the id
                            },
                        },
                        routeConfig: { path: 'test' },
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
        component.ngOnInit();
        fixture.detectChanges();
        expect(spyGetModules).toHaveBeenCalledWith('test');
        expect(spyGetTool).toHaveBeenCalledTimes(0);
        expect(component.module).toMatchObject(mockedModule);
        expect(component.isLoading).toBe(false);
    });

    it('should load tool information correctly', () => {
        component.isTool = true;
        const spyGetTool = jest.spyOn(mockedToolsService, 'getTool');
        component.ngOnInit();
        fixture.detectChanges();
        expect(spyGetTool).toHaveBeenCalledWith('test');
        expect(component.module).toMatchObject(mockedModule);
        expect(component.isLoading).toBe(false);
    });
});
