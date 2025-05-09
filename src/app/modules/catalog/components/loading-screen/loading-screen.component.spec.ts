import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
    flush,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TryMeService } from '@app/modules/try-me/services/try-me.service';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedSnackbarService } from '@app/shared/mocks/snackbar-service.mock';
import { mockedTryMeService } from '@app/shared/mocks/try-me.service.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingScreenComponent } from './loading-screen.component';

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
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call closeWindowDueError if no moduleData in sessionStorage', () => {
        const spy = jest.spyOn(component as any, 'closeWindowDueError');
        component.ngOnInit();
        expect(spy).toHaveBeenCalledWith(
            'Error initializing the deployment. Please try again later.'
        );
    });

    it('should handle error if JSON.parse fails', () => {
        sessionStorage.setItem('moduleData', 'invalid json');
        const spy = jest.spyOn(mockedSnackbarService, 'openError');

        component.ngOnInit();

        expect(spy).toHaveBeenCalledWith(
            'Error initializing the deployment. Please try again later.'
        );
    });

    it('should parse moduleData and call createGradioDeployment', fakeAsync(() => {
        const fakeModule = { id: 'module-id' };
        sessionStorage.setItem(
            'moduleData',
            JSON.stringify({ id: 'module-id' })
        );
        const spy = jest.spyOn(component, 'createGradioDeployment');

        component.ngOnInit();

        tick(100);
        expect(component.module).toEqual(fakeModule);
        expect(spy).toHaveBeenCalled();

        flush();
    }));
});
