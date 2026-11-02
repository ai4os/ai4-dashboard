import {
    fakeAsync,
    ComponentFixture,
    TestBed,
    tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DeploymentDetailComponent } from './deployment-detail.component';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { TryMeService } from '@app/modules/try-me/services/try-me.service';
import { BatchService } from '@app/modules/batch/services/batch.service';
import { PlatformStatusService } from '@app/shared/services/platform-status/platform-status.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedDeployment } from '@app/modules/deployments/services/deployments-service/deployments.service.mock';
import { testProviders } from '@testing/test-providers';

describe('DeploymentDetailComponent', () => {
    let component: DeploymentDetailComponent;
    let fixture: ComponentFixture<DeploymentDetailComponent>;
    let routeUuid: string;
    let routeType: string | null;
    let deploymentService: {
        getToolByUUID: jest.Mock;
        getDeploymentByUUID: jest.Mock;
    };
    let secretsService: { getSecrets: jest.Mock };
    let snackbarService: { openError: jest.Mock };

    beforeEach(async () => {
        TestBed.overrideComponent(DeploymentDetailComponent, {
            set: { template: '' },
        });

        routeUuid = '';
        routeType = null;
        deploymentService = {
            getToolByUUID: jest
                .fn()
                .mockReturnValue(
                    of({ ...mockedDeployment, status: 'stopped' })
                ),
            getDeploymentByUUID: jest
                .fn()
                .mockReturnValue(
                    of({ ...mockedDeployment, status: 'stopped' })
                ),
        };
        secretsService = {
            getSecrets: jest.fn().mockReturnValue(of({})),
        };
        snackbarService = { openError: jest.fn() };

        await TestBed.configureTestingModule({
            imports: [DeploymentDetailComponent],
            providers: [
                ...testProviders,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            data: {},
                            paramMap: {
                                get: (name: string) =>
                                    name === 'uuid' ? routeUuid : null,
                            },
                            queryParamMap: {
                                get: (name: string) =>
                                    name === 'type' ? routeType : null,
                            },
                            routeConfig: { path: 'deployments/:uuid' },
                        },
                        params: of({}),
                        data: of({}),
                        url: of([]),
                        queryParams: of({}),
                        children: [],
                    },
                },
                { provide: DeploymentsService, useValue: deploymentService },
                { provide: SecretsService, useValue: secretsService },
                {
                    provide: TryMeService,
                    useValue: {
                        getDeploymentGradioByUUID: jest
                            .fn()
                            .mockReturnValue(of(mockedDeployment)),
                    },
                },
                {
                    provide: BatchService,
                    useValue: {
                        getBatchDeploymentByUUID: jest
                            .fn()
                            .mockReturnValue(of(mockedDeployment)),
                    },
                },
                {
                    provide: PlatformStatusService,
                    useValue: {
                        getActiveDatacenterNotifications: jest
                            .fn()
                            .mockReturnValue(of([])),
                    },
                },
                { provide: SnackbarService, useValue: snackbarService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeploymentDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('does not request deployment data when the route has no UUID', () => {
        expect(deploymentService.getDeploymentByUUID).not.toHaveBeenCalled();
        expect(deploymentService.getToolByUUID).not.toHaveBeenCalled();
        expect(component.isLoading).toBe(false);
    });

    it('loads the tool deployment identified by the route', fakeAsync(() => {
        routeUuid = 'tool-test';
        routeType = 'tool';

        component.ngOnInit();
        tick(0);

        expect(deploymentService.getToolByUUID).toHaveBeenCalledWith(
            'tool-test'
        );
        expect(component.deployment?.status).toBe('stopped');
        expect(component.isLoading).toBe(false);
    }));

    it('loads a module deployment when the route type is absent', fakeAsync(() => {
        routeUuid = 'module-test';

        component.ngOnInit();
        tick(0);

        expect(deploymentService.getDeploymentByUUID).toHaveBeenCalledWith(
            'module-test'
        );
        expect(component.deployment?.description).toBe('-');
    }));

    it('detects an error on the loaded deployment', fakeAsync(() => {
        deploymentService.getToolByUUID.mockReturnValue(
            of({
                ...mockedDeployment,
                status: 'failed',
                error_msg: 'deployment failed',
            })
        );
        routeUuid = 'failed-tool';
        routeType = 'tool';

        component.ngOnInit();
        tick(0);

        expect(component['deploymentHasError']).toBe(true);
    }));

    it('loads the VLLM token for an LLM tool deployment', fakeAsync(() => {
        deploymentService.getToolByUUID.mockReturnValue(
            of({
                ...mockedDeployment,
                tool_name: 'ai4os-llm',
                status: 'running',
            })
        );
        secretsService.getSecrets.mockReturnValue(
            of({ llm: { token: 'test-token' } })
        );
        routeUuid = 'llm-tool';
        routeType = 'tool';

        component.ngOnInit();
        tick(0);

        expect(secretsService.getSecrets).toHaveBeenCalledWith(
            '/deployments/llm-tool/llm'
        );
        expect(component.tokenField.value).toBe('test-token');
    }));

    it('reports a VLLM token request error and clears the loading state', () => {
        secretsService.getSecrets.mockReturnValue(
            throwError(() => new Error('network error'))
        );
        component.uuid = 'tool-test';
        component.isLoading = true;

        component.getVllmKey();

        expect(snackbarService.openError).toHaveBeenCalledWith(
            expect.stringContaining("Couldn't retrieve VLLM Token")
        );
        expect(component.isLoading).toBe(false);
    });

    it('formats resource values with the corresponding units', () => {
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
