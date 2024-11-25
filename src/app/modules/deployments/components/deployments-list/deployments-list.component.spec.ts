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
import { mockedSnapshots } from '../../services/snapshots-service/snapshot.service.mock';
import {
    mockedDeployments,
    mockedDeleteDeploymentResponse,
    mockedTools,
} from '../../services/deployments-service/deployment.service.mock';

const mockedConfigService: any = {};

const mockedDeploymentService: any = {
    getDeployments: jest.fn().mockReturnValue(of(mockedDeployments)),
    getDeploymentByUUID: jest.fn().mockReturnValue(of(mockedDeployments[0])),
    deleteDeploymentByUUID: jest
        .fn()
        .mockReturnValue(of(mockedDeleteDeploymentResponse)),
    getTools: jest.fn().mockReturnValue(of(mockedTools)),
    getToolByUUID: jest.fn().mockReturnValue(of(mockedTools[0])),
    deleteToolByUUID: jest
        .fn()
        .mockReturnValue(of(mockedDeleteDeploymentResponse)),
};

const mockedSnapshotService: any = {
    getSnapshots: jest.fn().mockReturnValue(of(mockedSnapshots)),
    deleteSnapshotByUUID: jest
        .fn()
        .mockReturnValue(of(mockedDeleteDeploymentResponse)),
};

const mockedMediaQueryList: MediaQueryList = {
    matches: true,
    media: 'test',
    onchange: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
};
const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

const mockedSnackbarService: any = {
    openSuccess: jest.fn(),
    openError: jest.fn(),
};

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

        const expectedModulesDataset = [
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

        const expectedToolsDataset = [
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

        const expectedSnapshotsDataset = [
            {
                uuid: 'snapshot-test',
                name: '',
                description: '',
                status: '',
                containerName: '',
                tagName: 'snapshot-test',
                size: '1.92',
                creationTime: '',
                snapshot_ID: 'snapshot-test',
            },
            {
                uuid: 'snapshot-test2',
                name: '',
                description: '',
                status: '',
                containerName: '',
                tagName: 'snapshot-test2',
                size: '1.92',
                creationTime: '',
                snapshot_ID: 'snapshot-test2',
            },
        ];

        component.ngOnInit();
        tick(100);
        expect(spyGetModulesList).toHaveBeenCalledTimes(1);
        expect(spyGetModulesDeploymentsService).toHaveBeenCalled();
        expect(component.modulesDataset).toEqual(expectedModulesDataset);
        expect(component.modulesDataSource.filteredData).toEqual(
            expectedModulesDataset
        );
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

        const expectedDataset = [initialDataset[1]];
        component.modulesDataset = initialDataset;
        component.removeModule('module-test');

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

        const expectedDataset = [initialDataset[1]];
        component.toolsDataset = initialDataset;
        component.removeTool('tool-test');

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
                name: '',
                description: '',
                status: '',
                containerName: '',
                tagName: 'snapshot-test',
                size: '1.92',
                creationTime: '',
                snapshot_ID: 'snapshot-test',
            },
            {
                uuid: 'snapshot-test2',
                name: '',
                description: '',
                status: '',
                containerName: '',
                tagName: 'snapshot-test2',
                size: '1.92',
                creationTime: '',
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
                name: '',
                description: '',
                status: '',
                containerName: '',
                tagName: 'snapshot-test',
                size: '1.92',
                creationTime: '',
                snapshot_ID: 'snapshot-test',
            },
            {
                uuid: 'snapshot-test2',
                name: '',
                description: '',
                status: '',
                containerName: '',
                tagName: 'snapshot-test2',
                size: '1.92',
                creationTime: '',
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
