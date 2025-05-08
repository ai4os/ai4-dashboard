import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingScreenComponent } from './loading-screen.component';
import { ModulesService } from '../../services/modules-service/modules.service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedModuleService } from '@app/shared/mocks/modules-service.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedSnackbarService } from '@app/shared/mocks/snackbar-service.mock';
import { TryMeService } from '@app/modules/try-me/services/try-me.service';
import { mockedTryMeService } from '@app/shared/mocks/try-me-service.mock';

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
                { provide: SnackbarService, useValue: mockedSnackbarService },
                { provide: TryMeService, useValue: mockedTryMeService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
