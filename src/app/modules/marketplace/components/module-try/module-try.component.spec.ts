import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleTryComponent } from './module-try.component';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Module } from '@app/shared/interfaces/module.interface';
import { of } from 'rxjs';
import { ModulesService } from '../../services/modules-service/modules.service';
import { ActivatedRoute } from '@angular/router';

const mockedConfigService: any = {};
const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
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

const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

const mockedModuleService: any = {
    getModule: jest.fn().mockReturnValue(of(mockedModule)),
};

describe('ModuleTestComponent', () => {
    let component: ModuleTryComponent;
    let fixture: ComponentFixture<ModuleTryComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            declarations: [ModuleTryComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                SharedModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
            ],
            providers: [
                FormBuilder,
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: ModulesService, useValue: mockedModuleService },
                { provide: FormGroupDirective, useValue: formGroupDirective },
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

        fixture = TestBed.createComponent(ModuleTryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
