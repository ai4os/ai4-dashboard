import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFormComponent } from './stepper-form.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterModule } from '@angular/router';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedOscarInferenceService } from '@app/modules/inference/services/oscar-inference.service.mock';
import { OscarInferenceService } from '@app/modules/inference/services/oscar-inference.service';
import { mockedDeploymentService } from '@app/modules/deployments/services/deployments-service/deployments.service.mock';
import { mockedSnackbarService } from '@app/shared/services/snackbar/snackbar-service.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { of, throwError } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DeploymentsListComponent } from '@app/modules/deployments/components/deployments-list/deployments-list.component';
import { InferencesListComponent } from '@app/modules/inference/components/inferences-list/inferences-list.component';
import { testProviders } from '@testing/test-providers';

describe('StepperFormComponent', () => {
    let component: StepperFormComponent;
    let fixture: ComponentFixture<StepperFormComponent>;

    beforeEach(async () => {
        const formGroupDirective = new FormGroupDirective([], []);
        await TestBed.configureTestingModule({
            imports: [
                StepperFormComponent,
                TranslatePipe,
                TranslateDirective,
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
                ...testProviders,

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
        it('should update toggle', () => {
            const emitSpy = jest.spyOn(component.showHelpButtonEvent, 'emit');
            component.showHelpButtonChange(true);
            expect(emitSpy).toHaveBeenCalledWith(true);
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
