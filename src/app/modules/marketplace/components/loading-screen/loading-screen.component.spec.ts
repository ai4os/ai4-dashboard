import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingScreenComponent } from './loading-screen.component';
import { ModulesService } from '../../services/modules-service/modules.service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedModuleService: any = {
    createDeploymentGradio: jest.fn(),
    getDeploymentGradio: jest.fn(),
};

const mockedConfigService: any = {};

describe('LoadingScreenComponent', () => {
    let component: LoadingScreenComponent;
    let fixture: ComponentFixture<LoadingScreenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadingScreenComponent],
            imports: [
                NoopAnimationsModule,
                SharedModule,
                TranslateModule.forRoot(),
            ],

            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: ModulesService, useValue: mockedModuleService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
