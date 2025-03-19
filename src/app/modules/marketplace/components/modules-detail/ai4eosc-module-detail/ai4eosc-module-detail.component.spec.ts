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
import { Ai4eoscModule } from '@app/shared/interfaces/module.interface';
import { ToolsService } from '../../../services/tools-service/tools.service';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { of } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { mockedUserProfile } from '@app/core/services/auth/user-profile.mock';

const mockedConfigService: any = {};
const mockedAuthService: any = {
    userProfileSubject: of({}),
    loadUserProfile: jest
        .fn()
        .mockReturnValue(Promise.resolve(mockedUserProfile)),
    isAuthenticated: jest.fn().mockReturnValue(of(true)),
};
const mockedModule: Ai4eoscModule = {
    title: 'test',
    summary: 'summary',
    description: '',
    links: {
        source_code: '',
    },
    libraries: ['testLib'],
    tasks: ['task1'],
    categories: ['cat1'],
    tags: ['tag1'],
    id: 'test',
    license: 'MIT',
};

const mockedMediaQueryList: MediaQueryList = {
    matches: true,
    media: 'test',
    onchange: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
};

const mockedModuleService: any = {
    getModule: jest.fn().mockReturnValue(of(mockedModule)),
};

const mockedToolService: any = {
    getTool: jest.fn().mockReturnValue(of(mockedModule)),
};

const mockedMarkdownService: any = {
    reload$: of(),
    parse: jest.fn().mockReturnValue(of('')),
    render: jest.fn().mockImplementation(() => null),
};

const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

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
                { provide: ModulesService, useValue: mockedModuleService },
                { provide: ToolsService, useValue: mockedToolService },
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
        const spyGetModules = jest.spyOn(mockedModuleService, 'getModule');
        const spyGetTool = jest.spyOn(mockedToolService, 'getTool');
        component.ngOnInit();
        fixture.detectChanges();
        expect(spyGetModules).toHaveBeenCalledWith('test');
        expect(spyGetTool).toHaveBeenCalledTimes(0);
        expect(component.module).toMatchObject(mockedModule);
        expect(component.isLoading).toBe(false);
    });

    it('should load tool information correctly', () => {
        component.isTool = true;
        const spyGetTool = jest.spyOn(mockedToolService, 'getTool');
        component.ngOnInit();
        fixture.detectChanges();
        expect(spyGetTool).toHaveBeenCalledWith('test');
        expect(component.module).toMatchObject(mockedModule);
        expect(component.isLoading).toBe(false);
    });
});
