import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFormComponent } from './stepper-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedOscarInferenceService } from '@app/shared/mocks/oscar-inference.service.mock';
import { OscarInferenceService } from '@app/modules/inference/services/oscar-inference.service';
import { mockedDeploymentService } from '@app/shared/mocks/deployments.service.mock';
import { mockedSnackbarService } from '@app/shared/mocks/snackbar-service.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { of, throwError } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeploymentsListComponent } from '@app/modules/deployments/components/deployments-list/deployments-list.component';
import { InferencesListComponent } from '@app/modules/inference/components/inferences-list/inferences-list.component';

describe('StepperFormComponent', () => {
    let component: StepperFormComponent;
    let fixture: ComponentFixture<StepperFormComponent>;

    beforeEach(async () => {
        const formGroupDirective = new FormGroupDirective([], []);
        await TestBed.configureTestingModule({
            declarations: [StepperFormComponent],
            imports: [
                SharedModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                RouterModule.forRoot([
                    {
                        path: 'tasks/deployments',
                        component: DeploymentsListComponent,
                    },
                    {
                        path: 'tasks/inference',
                        component: InferencesListComponent,
                    },
                ]),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: SnackbarService, useValue: mockedSnackbarService },
                {
                    provide: DeploymentsService,
                    useValue: mockedDeploymentService,
                },
                {
                    provide: OscarInferenceService,
                    useValue: mockedOscarInferenceService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StepperFormComponent);
        component = fixture.componentInstance;
        initializeForms(component);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('submitTrainingRequest()', () => {
        it('should call createNomadService when platform is nomad', () => {
            component.platform = 'nomad';
            const spy = jest.spyOn(component, 'createNomadService');
            component.submitTrainingRequest();
            expect(spy).toHaveBeenCalled();
        });

        it('should call createOscarService when platform is not nomad', () => {
            component.platform = 'oscar';
            const spy = jest.spyOn(component, 'createOscarService');
            component.submitTrainingRequest();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('createNomadService()', () => {
        it('should call trainTool and handle success', async () => {
            await component.createNomadService();
            expect(mockedSnackbarService.openSuccess).toHaveBeenCalledWith(
                'Deployment created with ID 123'
            );
        });

        it('should show error on trainTool failure', async () => {
            jest.spyOn(
                mockedDeploymentService,
                'postTrainModule'
            ).mockReturnValue(
                of({ status: 'fail', error_msg: 'test error reason' })
            );
            await component.createNomadService();
            expect(mockedSnackbarService.openError).toHaveBeenCalledWith(
                'Error while creating the deployment test error reason'
            );
        });

        it('should handle observable error', async () => {
            jest.spyOn(mockedDeploymentService, 'trainTool').mockReturnValue(
                throwError(() => new Error('error'))
            );
            await component.createNomadService();
            expect(component.isLoading).toBe(false);
        });
    });

    describe('createOscarService()', () => {
        it('should create OSCAR service and navigate on success', async () => {
            await component.createOscarService();
            expect(mockedSnackbarService.openSuccess).toHaveBeenCalledWith(
                'OSCAR service created with uuid mock-uuid'
            );
        });

        it('should handle createService error', async () => {
            jest.spyOn(
                mockedOscarInferenceService,
                'createService'
            ).mockReturnValue(throwError(() => new Error('fail')));
            await component.createOscarService();
            expect(component.isLoading).toBe(false);
        });
    });

    describe('getStepperOrientation()', () => {
        it('should return vertical if is mobile', () => {
            expect(component.getStepperOrientation()).toBe('vertical');
        });

        it('should return horizontal if not mobile', () => {
            mockedMediaMatcher.matchMedia.mockReturnValue({
                matches: false,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                media: '(max-width: 650px)',
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                dispatchEvent: jest.fn(),
            });

            fixture = TestBed.createComponent(StepperFormComponent);
            component = fixture.componentInstance;
            initializeForms(component);
            fixture.detectChanges();

            expect(component.getStepperOrientation()).toBe('horizontal');
        });
    });

    describe('showHelpButtonChange()', () => {
        it('should emit event', () => {
            const emitSpy = jest.spyOn(component.showHelpButtonEvent, 'emit');
            const event = { checked: true } as MatSlideToggleChange;
            component.showHelpButtonChange(event);
            expect(emitSpy).toHaveBeenCalledWith(event);
        });
    });
});

function initializeForms(component: StepperFormComponent) {
    component.step1Form = new FormBuilder().group({
        generalConfForm: new FormBuilder().group({
            titleInput: ['CVAT Image Annotation'],
            descriptionInput: ['desc'],
            co2EmissionsInput: ['0'],
            dockerImageInput: ['image'],
            dockerTagSelect: ['latest'],
            serviceToRunChip: [''],
            serviceToRunPassInput: [''],
            cvatUsernameInput: ['user'],
            cvatPasswordInput: ['pass'],
            modelIdSelect: ['model'],
        }),
    });

    component.step2Form = new FormBuilder().group({
        hardwareConfForm: new FormBuilder().group({
            cpuNumberInput: [2],
            ramMemoryInput: ['8000'],
        }),
    });

    component.step3Form = new FormBuilder().group({
        storageConfForm: new FormBuilder().group({
            rcloneConfInput: ['conf'],
            storageUrlInput: ['url'],
            rcloneVendorSelect: ['vendor'],
            rcloneUserInput: ['user'],
            rclonePasswordInput: ['pass'],
            snapshotDatasetSelect: ['snapshot'],
            datasetsList: [{ doi: '12345', force_pull: false }],
        }),
    });
}
