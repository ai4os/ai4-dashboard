import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleDetailComponent } from './module-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TopNavbarComponent } from '@app/layout/top-navbar/top-navbar.component';
import { ModulesService } from '../../services/modules-service/modules.service';
import { ActivatedRoute } from '@angular/router';
import { Module } from '@app/shared/interfaces/module.interface';
import { ToolsService } from '../../services/tools-service/tools.service';
import { MarkdownComponent, MarkdownService } from 'ngx-markdown';
import { of } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

const mockedProfile = {
    info: {
        exp: 1693908513,
        iat: 1693907913,
        auth_time: 1693907911,
        jti: '00000000-c9e1-44b7-b313-4bde8fba70fa',
        iss: 'https://aai-demo.egi.eu/auth/realms/egi',
        aud: 'ai4eosc-dashboard',
        sub: 'test@egi.eu',
        typ: 'ID',
        azp: 'ai4eosc-dashboard',
        nonce: 'WnVHR3ZpOVoyVlFwcjVGTEtIRWhyUTZ0eXJYVHZxN1M4TX5MRzVKWVJYVHZx',
        session_state: '00000000-818c-46d4-ad87-1b9a1c22c43f',
        at_hash: 'gdEA9VsgdEA9V-mubWhBWw',
        sid: 'b27a9b7a-818c-46d4-ad87-1b9a1818c43f',
        voperson_verified_email: ['test@ifca.unican.es'],
        email_verified: true,
        name: 'AI4EOSC Dasboard Test',
        preferred_username: 'ai4dash',
        eduperson_assurance: [
            'https://refeds.org/assurance/IAP/low',
            'https://aai.egi.eu/LoA#Low',
        ],
        given_name: 'AI4EOSC Dasboard ',
        family_name: 'Test',
        email: 'test@ifca.unican.es',
        eduperson_entitlement: [
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=vm_operator#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=vm_operator#aai.egi.eu',
        ],
    },
};

const mockedConfigService: any = {};
const mockedAuthService: any = {
    userProfileSubject: of({}),
    loadUserProfile: jest.fn().mockReturnValue(Promise.resolve(mockedProfile)),
    isAuthenticated: jest.fn().mockReturnValue(of(true)),
};
const mockedModule: Module = {
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
    let component: ModuleDetailComponent;
    let fixture: ComponentFixture<ModuleDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ModuleDetailComponent,
                TopNavbarComponent,
                MarkdownComponent,
            ],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                SharedModule,
                TranslateModule.forRoot(),
            ],
            providers: [
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

        fixture = TestBed.createComponent(ModuleDetailComponent);
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
