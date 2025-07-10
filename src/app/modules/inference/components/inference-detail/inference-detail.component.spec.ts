import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InferenceDetailComponent } from './inference-detail.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { OscarInferenceService } from '../../services/oscar-inference.service';
import { mockedOscarInferenceService } from '@app/modules/inference/services/oscar-inference.service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { throwError } from 'rxjs';

describe('InferenceDetailComponent', () => {
    let component: InferenceDetailComponent;
    let fixture: ComponentFixture<InferenceDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InferenceDetailComponent],
            imports: [
                SharedModule,
                TranslateModule.forRoot(),
                BrowserAnimationsModule,
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: OscarInferenceService,
                    useValue: mockedOscarInferenceService,
                },
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(InferenceDetailComponent);
        component = fixture.componentInstance;
        component.data = { name: 'test-service' };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load service on init and assign values', () => {
        expect(
            mockedOscarInferenceService.getServiceByName
        ).toHaveBeenCalledWith('test-service');
        expect(component.service?.title).toBe('Oscar Service Mock Title');
        expect(component.tokenField.value).toBe('mock-token');
        expect(component.accessKeyField.value).toBe('mock-access-key');
        expect(component.minioSecretField.value).toBe('mock-secret-key');
        expect(component.isLoading).toBe(false);
    });

    it('should close dialog on service error', () => {
        mockedOscarInferenceService.getServiceByName.mockReturnValue(
            throwError(() => new Error('Error'))
        );

        component.ngOnInit();

        expect(mockedOscarInferenceService.getServiceByName).toHaveBeenCalled();
        expect(component.isLoading).toBe(false);
    });

    it('should open documentation URL in a new window', () => {
        const openSpy = jest
            .spyOn(window, 'open')
            .mockImplementation(() => null);
        const event = new MouseEvent('click');
        component.openDocumentationWeb();
        expect(openSpy).toHaveBeenCalledWith(
            'https://docs.ai4os.eu/en/latest/howtos/deploy/oscar.html'
        );
        openSpy.mockRestore();
    });
});
