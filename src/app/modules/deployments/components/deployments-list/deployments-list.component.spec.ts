import {
    ComponentFixture,
    TestBed,
    discardPeriodicTasks,
    fakeAsync,
    flush,
    tick,
} from '@angular/core/testing';
import { DeploymentsListComponent } from './deployments-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { BrowserModule, By } from '@angular/platform-browser';
import { DeploymentDetailComponent } from '../deployment-detail/deployment-detail.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { SnapshotService } from '../../services/snapshots-service/snapshot.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import {
    expectedModulesDataset,
    expectedSnapshotsDataset,
    expectedToolsDataset,
    mockedDeploymentService,
} from '@app/modules/deployments/services/deployments-service/deployments.service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedSnackbarService } from '@app/shared/services/snackbar/snackbar-service.mock';
import { mockedSnapshotService } from '@app/modules/deployments/services/snapshots-service/snapshots.service.mock';
import { parseDateStringLiteral } from '@app/shared/utils/formatDate';

describe('DeploymentsListComponent', () => {
    let component: DeploymentsListComponent;
    let fixture: ComponentFixture<DeploymentsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeploymentsListComponent, DeploymentDetailComponent],
            imports: [
                SharedModule,
                BrowserModule,
                RouterModule.forRoot([]),
                NoopAnimationsModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: DeploymentsService,
                    useValue: mockedDeploymentService,
                },
                {
                    provide: SnapshotService,
                    useValue: mockedSnapshotService,
                },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                {
                    provide: SnackbarService,
                    useValue: mockedSnackbarService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeploymentsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get deployments list correctly', fakeAsync(() => {
        // get modules
        const spyGetModulesList = jest.spyOn(component, 'getModulesList');
        const spyGetModulesDeploymentsService = jest.spyOn(
            mockedDeploymentService,
            'getDeployments'
        );

        // get tools
        const spyGetToolsList = jest.spyOn(component, 'getToolsList');
        const spyGetToolsDeploymentsService = jest.spyOn(
            mockedDeploymentService,
            'getTools'
        );

        // get snapshots
        const spyGetSnapshotsList = jest.spyOn(component, 'getSnapshotsList');
        const spyGetSnapshotsDeploymentsService = jest.spyOn(
            mockedSnapshotService,
            'getSnapshots'
        );

        component.ngOnInit();
        tick(100);
        expect(spyGetModulesList).toHaveBeenCalledTimes(1);
        expect(spyGetModulesDeploymentsService).toHaveBeenCalled();
        component.modulesDataset.forEach((item, i) => {
            const expected = expectedModulesDataset[i];

            // Compare creationTime as timestamps to avoid timezone issues
            const receivedTime = parseDateStringLiteral(item.creationTime);
            const expectedTime = parseDateStringLiteral(expected.creationTime);
            expect(receivedTime).toBe(expectedTime);

            // Compare the rest of the properties separately
            const { creationTime: _, ...itemRest } = item;
            const { creationTime: __, ...expectedRest } = expected;
            expect(itemRest).toEqual(expectedRest);
        });
        component.modulesDataSource.filteredData.forEach((item, i) => {
            const expected = expectedModulesDataset[i];

            // Compare creationTime as timestamps to avoid timezone issues
            const receivedTime = parseDateStringLiteral(item.creationTime);
            const expectedTime = parseDateStringLiteral(expected.creationTime);
            expect(receivedTime).toBe(expectedTime);

            // Compare the rest of the properties separately
            const { creationTime: _, ...itemRest } = item;
            const { creationTime: __, ...expectedRest } = expected;
            expect(itemRest).toEqual(expectedRest);
        });
        expect(spyGetToolsList).toHaveBeenCalledTimes(1);
        expect(spyGetToolsDeploymentsService).toHaveBeenCalled();
        expect(component.toolsDataset).toEqual(expectedToolsDataset);
        expect(component.toolsDataSource.filteredData).toEqual(
            expectedToolsDataset
        );
        expect(spyGetSnapshotsList).toHaveBeenCalledTimes(1);
        expect(spyGetSnapshotsDeploymentsService).toHaveBeenCalled();
        expect(component.snapshotsDataset).toEqual(expectedSnapshotsDataset);
        expect(component.snapshotsDataSource.filteredData).toEqual(
            expectedSnapshotsDataset
        );

        flush();
        discardPeriodicTasks();
    }));

    it('should DELETE a module deployment correctly if confirmed and no error from API', fakeAsync(() => {
        const spyRemoveModule = jest.spyOn(component, 'removeModule');
        const spyRemoveModuleDeploymentsService = jest.spyOn(
            mockedDeploymentService,
            'deleteDeploymentByUUID'
        );
        const spySuccessSnackbar = jest.spyOn(
            mockedSnackbarService,
            'openSuccess'
        );

        const initialDataset = [
            {
                uuid: '3639771e-35c1-11ee-867a-0242ac110002',
                name: 'Test title 1',
                status: 'running',
                containerName: 'deephdc/ai4os-dev-env:latest',
                gpus: 0,
                creationTime: '2023-08-08 07:57:26',
                endpoints: {
                    api: 'http://deepaas-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
                    monitor:
                        'http://monitor-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
                    ide: 'http://ide-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
                },
                mainEndpoint:
                    'http://ide-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
                datacenter: 'ai-ifca',
            },
            {
                uuid: '26d3fb98-32b8-11ee-a694-0242ac110003',
                name: 'Test tittle 2',
                status: 'running',
                containerName: 'deephdc/ai4os-dev-env:latest',
                gpus: 0,
                creationTime: '18:48:28 08-04-2023',
                endpoints: {
                    api: 'http://deepaas-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
                    monitor:
                        'http://monitor-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
                    ide: 'http://ide-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
                },
                mainEndpoint:
                    'http://ide-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
                datacenter: 'ai-ifca',
            },
        ];

        const expectedDataset = [initialDataset[1]];
        component.modulesDataset = initialDataset;
        component.removeModule('3639771e-35c1-11ee-867a-0242ac110002');

        expect(spyRemoveModule).toHaveBeenCalledTimes(1);
        expect(spyRemoveModuleDeploymentsService).toHaveBeenCalled();
        expect(spySuccessSnackbar).toHaveBeenCalledTimes(1);
        expect(component.modulesDataset).toEqual(expectedDataset);

        jest.clearAllMocks();
    }));

    it('should DELETE a tool deployment correctly if confirmed and no error from API', fakeAsync(() => {
        const spyRemoveTool = jest.spyOn(component, 'removeTool');
        const spyRemoveToolDeploymentsService = jest.spyOn(
            mockedDeploymentService,
            'deleteToolByUUID'
        );
        const spySuccessSnackbar = jest.spyOn(
            mockedSnackbarService,
            'openSuccess'
        );

        const initialDataset = [
            {
                uuid: '9a76ae28-465a-11ee-9920-0242ac110003',
                name: 'Testing federated',
                status: 'running',
                containerName: 'ai4oshub/ai4os-federated-server:latest',
                gpus: 0,
                creationTime: '2023-08-29 10:55:46',
                endpoints: {
                    ide: 'http://ide-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',
                },
                mainEndpoint:
                    'http://fedserver-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',

                datacenter: 'ai-ifca',
            },
            {
                uuid: '4576ae28-465a-11ee-9920-0242ac110003',
                name: 'Testing cvat',
                status: 'running',
                containerName: 'ai4oshub/ai4os-cvat:latest',
                gpus: 0,
                creationTime: '2023-08-29 10:55:46',
                endpoints: {
                    ide: 'http://ide-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',
                },
                mainEndpoint:
                    'http://cvat-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',

                datacenter: 'ai-ifca',
            },
        ];

        const expectedDataset = [initialDataset[1]];
        component.toolsDataset = initialDataset;
        component.removeTool('9a76ae28-465a-11ee-9920-0242ac110003');

        expect(spyRemoveTool).toHaveBeenCalledTimes(1);
        expect(spyRemoveToolDeploymentsService).toHaveBeenCalled();
        expect(spySuccessSnackbar).toHaveBeenCalledTimes(1);
        expect(component.toolsDataset).toEqual(expectedDataset);

        jest.clearAllMocks();
    }));

    it('should DELETE a snapshot deployment correctly if confirmed and no error from API', fakeAsync(() => {
        const spyRemoveSnapshot = jest.spyOn(component, 'removeSnapshot');
        const spyRemoveSnapshotDeploymentsService = jest.spyOn(
            mockedSnapshotService,
            'deleteSnapshotByUUID'
        );
        const spySuccessSnackbar = jest.spyOn(
            mockedSnackbarService,
            'openSuccess'
        );

        const initialDataset = [
            {
                uuid: 'snapshot-test',
                name: 'SnapshotTest',
                description: '',
                status: 'complete',
                containerName:
                    'registry.services.ai4os.eu/user-snapshots/b965ce0bceb90d42b69d0767e2148c297e5f4a5d9db315432747e84a4ccebf0b_at_egi.eu',

                tagName: 'snapshot-test',
                size: '2064652547',
                creationTime: '2024-11-12 09:30:40',
                snapshot_ID: 'snapshot-test',
            },
            {
                uuid: 'snapshot-test2',
                name: 'SnapshotTest2',
                description:
                    'registry.services.ai4os.eu/user-snapshots/b965ce0bceb90d42b69d0767e2148c297e5f4a5d9db315432747e84a4ccebf0b_at_egi.eu',
                status: 'complete',
                containerName: '',
                tagName: 'snapshot-test',
                size: '2064652547',
                creationTime: '2024-11-12 09:30:40',
                snapshot_ID: 'snapshot-test2',
            },
        ];

        const expectedDataset = [initialDataset[1]];
        component.snapshotsDataset = initialDataset;
        component.removeSnapshot('snapshot-test');

        expect(spyRemoveSnapshot).toHaveBeenCalledTimes(1);
        expect(spyRemoveSnapshotDeploymentsService).toHaveBeenCalled();
        expect(spySuccessSnackbar).toHaveBeenCalledTimes(1);
        expect(component.snapshotsDataset).toEqual(expectedDataset);

        jest.clearAllMocks();
    }));

    it('should NOT delete a module if API returns an error', fakeAsync(() => {
        const initialDataset = [
            {
                uuid: 'module-test',
                name: '',
                status: '',
                containerName: 'ai4oshub/fast-neural-transfer:latest',
                gpus: 1,
                creationTime: '',
                endpoints: undefined,
                mainEndpoint: '',
                error_msg: 'Test error',
            },
            {
                uuid: 'module-test2',
                name: '',
                status: '',
                containerName: 'ai4oshub/fast-neural-transfer:latest',
                gpus: 1,
                creationTime: '',
                endpoints: undefined,
                mainEndpoint: '',
                error_msg: 'Test error',
            },
        ];
        const spyDeleteDeploymentByUUID = jest
            .spyOn(mockedDeploymentService, 'deleteDeploymentByUUID')
            .mockReturnValue(of({ status: 'error' }));
        const spyErrorSnackbar = jest.spyOn(mockedSnackbarService, 'openError');
        component.modulesDataset = initialDataset;
        component.removeModule('module-test');
        expect(spyDeleteDeploymentByUUID).toHaveBeenCalledTimes(1);
        expect(spyErrorSnackbar).toHaveBeenCalledTimes(1);
        expect(component.modulesDataset).toEqual(initialDataset);

        jest.clearAllMocks();
    }));

    it('should NOT delete a tool if API returns an error', fakeAsync(() => {
        const initialDataset = [
            {
                uuid: 'tool-test',
                name: '',
                status: '',
                containerName: '',
                gpus: 1,
                creationTime: '',
                endpoints: undefined,
                mainEndpoint: '',
                error_msg: 'Test error',
            },
            {
                uuid: 'tool-test2',
                name: '',
                status: '',
                containerName: '',
                gpus: 1,
                creationTime: '',
                endpoints: undefined,
                mainEndpoint: '',
                error_msg: 'Test error',
            },
        ];
        const spyDeleteToolByUUID = jest
            .spyOn(mockedDeploymentService, 'deleteToolByUUID')
            .mockReturnValue(of({ status: 'error' }));
        const spyErrorSnackbar = jest.spyOn(mockedSnackbarService, 'openError');
        component.toolsDataset = initialDataset;
        component.removeTool('tool-test');
        expect(spyDeleteToolByUUID).toHaveBeenCalledTimes(1);
        expect(spyErrorSnackbar).toHaveBeenCalledTimes(1);
        expect(component.toolsDataset).toEqual(initialDataset);

        jest.clearAllMocks();
    }));

    it('should NOT delete a snapshot if API returns an error', fakeAsync(() => {
        const initialDataset = [
            {
                uuid: 'snapshot-test',
                name: 'SnapshotTest',
                description: '',
                status: 'complete',
                containerName:
                    'registry.services.ai4os.eu/user-snapshots/b965ce0bceb90d42b69d0767e2148c297e5f4a5d9db315432747e84a4ccebf0b_at_egi.eu',

                tagName: 'snapshot-test',
                size: '2064652547',
                creationTime: '2024-11-12 09:30:40',
                snapshot_ID: 'snapshot-test',
            },
            {
                uuid: 'snapshot-test2',
                name: 'SnapshotTest2',
                description:
                    'registry.services.ai4os.eu/user-snapshots/b965ce0bceb90d42b69d0767e2148c297e5f4a5d9db315432747e84a4ccebf0b_at_egi.eu',
                status: 'complete',
                containerName: '',
                tagName: 'snapshot-test',
                size: '2064652547',
                creationTime: '2024-11-12 09:30:40',
                snapshot_ID: 'snapshot-test2',
            },
        ];
        const spyDeleteSnapshotByUUID = jest
            .spyOn(mockedSnapshotService, 'deleteSnapshotByUUID')
            .mockReturnValue(of({ status: 'error' }));
        const spyErrorSnackbar = jest.spyOn(mockedSnackbarService, 'openError');
        component.snapshotsDataset = initialDataset;
        component.removeSnapshot('snapshot-test');
        expect(spyDeleteSnapshotByUUID).toHaveBeenCalledTimes(1);
        expect(spyErrorSnackbar).toHaveBeenCalledTimes(1);
        expect(component.snapshotsDataset).toEqual(initialDataset);

        jest.clearAllMocks();
    }));

    it('should open deployment detail dialog correctly', fakeAsync(() => {
        component.ngOnInit();
        tick(100);
        fixture.detectChanges();

        jest.spyOn(component, 'openDeploymentDetailDialog');
        const openDeploymentDetailButton = fixture.debugElement.query(
            By.css('#infoButton')
        ).nativeElement;
        openDeploymentDetailButton.click();
        expect(component.openDeploymentDetailDialog).toHaveBeenCalledTimes(1);
        flush();
        discardPeriodicTasks();
    }));
});
