import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleTryComponent } from './module-try.component';
import {
    FormBuilder,
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {
    BrowserAnimationsModule,
    NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Module } from '@app/shared/interfaces/module.interface';
import { of } from 'rxjs';
import { ModulesService } from '../../services/modules-service/modules.service';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceModule } from '../../marketplace.module';
import { MaterialModule } from '@app/shared/material.module';

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

const mockedModuleService: any = {
    getModule: jest.fn().mockReturnValue(of(mockedModule)),
    getServices: jest.fn().mockReturnValue(of([])),
};

describe('ModuleTestComponent', () => {
    let component: ModuleTryComponent;
    let fixture: ComponentFixture<ModuleTryComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();

        await TestBed.configureTestingModule({
            declarations: [ModuleTryComponent],
            imports: [
                BrowserAnimationsModule,
                MarketplaceModule,
                SharedModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                FormBuilder,
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: ModulesService, useValue: mockedModuleService },
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
