import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeploymentDetailComponent } from './deployment-detail.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import {
    mockedDeployment,
    mockedDeploymentService,
} from '@app/modules/deployments/services/deployments-service/deployments.service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { of, throwError } from 'rxjs';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { mockedSecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedSnackbarService } from '@app/shared/services/snackbar/snackbar-service.mock';

describe('DeploymentDetailComponent', () => {
    let component: DeploymentDetailComponent;
    let fixture: ComponentFixture<DeploymentDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeploymentDetailComponent],
            imports: [
                RouterModule.forRoot([]),
                TranslateModule.forRoot(),
                MaterialModule,
                SharedModule,
                BrowserModule,
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                {
                    provide: DeploymentsService,
                    useValue: mockedDeploymentService,
                },
                { provide: SecretsService, useValue: mockedSecretsService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: SnackbarService, useValue: mockedSnackbarService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeploymentDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not crash if data is undefined or null', () => {
        component.data = undefined as any;
        expect(component).toBeTruthy();
    });

    it('should load tool deployment info correctly', () => {
        const mockedData = { uuid: 'tool-test', isTool: true };
        component.data = mockedData;
        const spyGetToolByUUID = jest.spyOn(
            mockedDeploymentService,
            'getToolByUUID'
        );
        component.ngOnInit();
        expect(spyGetToolByUUID).toHaveBeenCalledWith(mockedData.uuid);
    });

    it('should load module deployment info correctly', () => {
        const mockedData = { uuid: 'deployment-test', isTool: false };
        mockedDeployment.description = '';
        component.data = mockedData;
        const spyGetDeploymentByUUID = jest.spyOn(
            mockedDeploymentService,
            'getDeploymentByUUID'
        );
        component.ngOnInit();
        expect(spyGetDeploymentByUUID).toHaveBeenCalledWith(mockedData.uuid);
    });

    it('should load tool deployment and call getVllmKey if tool_name is ai4os-llm', () => {
        const mockedData = { uuid: 'tool-llm', isTool: true };
        const mockDeployment = {
            ...mockedDeployment,
            tool_name: 'ai4os-llm',
            error_msg: '',
            description: '',
            datacenter: null,
            status: 'running',
        };
        jest.spyOn(mockedDeploymentService, 'getToolByUUID').mockReturnValue(
            of(mockDeployment)
        );
        const spyGetVllm = jest
            .spyOn(component, 'getVllmKey')
            .mockImplementation();

        component.data = mockedData;
        component.ngOnInit();

        expect(spyGetVllm).toHaveBeenCalled();
        expect(component.statusBadge).toBeDefined();
    });

    it('should detect deployment error correctly', () => {
        const mockDeployment = { ...mockedDeployment, error_msg: 'some error' };
        jest.spyOn(mockedDeploymentService, 'getToolByUUID').mockReturnValue(
            of(mockDeployment)
        );

        component.data = { uuid: 'tool-x', isTool: true };
        component.ngOnInit();

        expect(component['deploymentHasError']).toBe(true);
    });

    it('should fetch VLLM token and update tokenField', () => {
        const mockToken = { something: { token: 'secret-token' } };
        mockedSecretsService.getSecrets.mockReturnValue(of(mockToken));

        component.data = { uuid: 'some-uuid', isTool: true };
        component.getVllmKey();

        expect(component.tokenField.value).toBe('secret-token');
        expect(component.isLoading).toBe(false);
    });

    it('should handle error when getVllmKey fails', () => {
        mockedSecretsService.getSecrets.mockReturnValue(
            throwError(() => new Error('network error'))
        );

        component.data = { uuid: 'some-uuid', isTool: true };
        component.getVllmKey();

        expect(mockedSnackbarService.openError).toHaveBeenCalledWith(
            expect.stringContaining("Couldn't retrieve VLLM Token")
        );
    });

    it('should return correct formatted resource value', () => {
        expect(
            component.getResourceValue({ key: 'CPU_MHz', value: 2200 })
        ).toBe('2200 MHz');
        expect(
            component.getResourceValue({ key: 'Memory_MB', value: 1024 })
        ).toBe('1024 MB');
        expect(component.getResourceValue({ key: 'Disk', value: 500 })).toBe(
            '500'
        );
    });
});
