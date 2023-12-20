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

const mockedConfigService: any = {};
const mockedAuthService: any = {
    userProfileSubject: of({}),
    isAuthenticated: jest.fn().mockReturnValue(of(true)),
};
const mockedModule: Module = {
    title: 'test',
    summary: '',
    description: '',
    keywords: [],
    license: '',
    date_creation: '',
    dataset_url: '',
    sources: {
        dockerfile_repo: '',
        docker_registry_repo: '',
        code: '',
    },
    continuous_integration: {
        build_status_badge: '',
        build_status_url: '',
    },
    tosca: [],
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
