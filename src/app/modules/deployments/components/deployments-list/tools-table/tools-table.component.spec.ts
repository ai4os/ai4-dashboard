import {
    ComponentFixture,
    TestBed,
    discardPeriodicTasks,
    fakeAsync,
    flush,
    tick,
} from '@angular/core/testing';

import { ToolsTableComponent } from './tools-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { Sort } from '@angular/material/sort';
import {
    Deployment,
    statusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { DeploymentDetailComponent } from '../../deployment-detail/deployment-detail.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { SecretManagementDetailComponent } from '../../secret-management-detail/secret-management-detail.component';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

const mockedDeleteToolResponse: statusReturn = {
    status: 'success',
};

const mockedTool: Deployment = {
    job_ID: 'tool-test',
    status: '',
    owner: '',
    title: '',
    docker_image: '',
    submit_time: '',
    main_endpoint: '',
    description: '',
    datacenter: '',
    error_msg: 'Test error',
    resources: {
        cpu_MHz: 0,
        cpu_num: 0,
        gpu_num: 1,
        memory_MB: 10,
        disk_MB: 20,
    },
};

const mockedConfigService: any = {};

const mockedDeploymentServices: any = {
    getTools: jest.fn().mockReturnValue(of([mockedTool])),
    getToolByUUID: jest.fn().mockReturnValue(of(mockedTool)),
    deleteToolByUUID: jest.fn().mockReturnValue(of(mockedDeleteToolResponse)),
};

const mockedSnackbarService: any = {
    openSuccess: jest.fn(),
    openError: jest.fn(),
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

const toolRow = {
    uuid: 'tool-test',
    name: '',
    status: 'running',
    containerName: '',
    gpus: 1,
    creationTime: '',
    endpoints: {},
    mainEndpoint: '',
    error_msg: 'Test error',
};

describe('ToolsTableComponent', () => {
    let component: ToolsTableComponent;
    let fixture: ComponentFixture<ToolsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ToolsTableComponent, DeploymentDetailComponent],
            imports: [
                SharedModule,
                RouterTestingModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: DeploymentsService,
                    useValue: mockedDeploymentServices,
                },
                {
                    provide: SnackbarService,
                    useValue: mockedSnackbarService,
                },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ToolsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call confirmation dialog when trying to delete a tool', fakeAsync(() => {
        const mouseEvent = new MouseEvent('click');
        const spyConfirmationDialog = jest.spyOn(
            component.confirmationDialog,
            'open'
        );
        component.removeTool(mouseEvent, toolRow);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
    }));

    it('should NOT delete a tool if user does not confirm it', fakeAsync(() => {
        const mouseEvent = new MouseEvent('click');
        const spyConfirmationDialog = jest
            .spyOn(component.confirmationDialog, 'open')
            .mockReturnValue({ afterClosed: () => of(false) } as MatDialogRef<
                typeof component
            >);
        const spyDeleteToolByUUID = jest.spyOn(
            mockedDeploymentServices,
            'deleteToolByUUID'
        );
        component.removeTool(mouseEvent, toolRow);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteToolByUUID).toHaveBeenCalledTimes(0);
    }));

    it('should DELETE a tool correctly if confirmed and no error from API', fakeAsync(() => {
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
        component.dataset = initialDataset;
        const mouseEvent = new MouseEvent('click');
        const spyConfirmationDialog = jest
            .spyOn(component.confirmationDialog, 'open')
            .mockReturnValue({ afterClosed: () => of(true) } as MatDialogRef<
                typeof component
            >);
        const spyDeleteToolByUUID = jest.spyOn(
            mockedDeploymentServices,
            'deleteToolByUUID'
        );
        const spySuccessSnackbar = jest.spyOn(
            mockedSnackbarService,
            'openSuccess'
        );
        component.removeTool(mouseEvent, toolRow);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteToolByUUID).toHaveBeenCalledTimes(1);
        expect(spySuccessSnackbar).toHaveBeenCalledTimes(1);
        expect(component.dataset).toEqual(expectedDataset);
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
        const mouseEvent = new MouseEvent('click');
        const spyConfirmationDialog = jest
            .spyOn(component.confirmationDialog, 'open')
            .mockReturnValue({ afterClosed: () => of(true) } as MatDialogRef<
                typeof component
            >);
        const spyDeleteToolByUUID = jest
            .spyOn(mockedDeploymentServices, 'deleteToolByUUID')
            .mockReturnValue(of({ status: 'error' }));
        const spyErrorSnackbar = jest.spyOn(mockedSnackbarService, 'openError');
        component.dataset = initialDataset;
        component.removeTool(mouseEvent, toolRow);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteToolByUUID).toHaveBeenCalledTimes(1);
        expect(spyErrorSnackbar).toHaveBeenCalledTimes(1);
        expect(component.dataset).toEqual(initialDataset);
    }));

    it('should return correctly a Tools status of running', () => {
        // Check Tool runnning
        let ToolStatus = component.isToolRunning(toolRow);
        expect(ToolStatus).toBe(true);
        // Check Tool status is empty
        toolRow.status = '';
        ToolStatus = component.isToolRunning(toolRow);
        expect(ToolStatus).toBe(false);
        // Check Tool status is random string
        toolRow.status = 'dasdadasdnotrunning';
        ToolStatus = component.isToolRunning(toolRow);
        expect(ToolStatus).toBe(false);
    });

    it('should return correctly a Tools endpoints', () => {
        //Endpoints undefined, should not crash
        component.getToolEndpoints(toolRow);
        expect(component).toBeTruthy();
        //Endpoints are returned correctly
        const expectedEndpoints = {
            test: 'test',
        };
        toolRow.endpoints = expectedEndpoints;
        const endpoints = component.getToolEndpoints(toolRow);
        expect(endpoints).toEqual(expectedEndpoints);
    });

    it('should return correctly a Tools error, if any', () => {
        //Error undefined, should not crash
        const nullData: unknown = undefined;
        toolRow.error_msg = nullData as string;
        component.hasToolErrors(toolRow);
        expect(component).toBeTruthy();
        //Errors are returned correctly
        toolRow.error_msg = 'Something failed';
        const errorMsg = component.hasToolErrors(toolRow);
        expect(errorMsg).toEqual('Something failed');
    });

    it('should return correctly a Tools badge correctly', () => {
        //Status undefined, should not crash
        const nullData: unknown = undefined;
        component.returnToolBadge(nullData as string);
        jest.spyOn(component, 'returnToolBadge');
        expect(component.returnToolBadge).toReturn;
        const badge = component.returnToolBadge('running');
        expect(badge).toEqual('running-brightgreen');
    });

    it('should open Tool detail dialog correctly', fakeAsync(() => {
        component.displayedColumns = [];
        component.ngOnInit();
        tick(100);
        fixture.detectChanges();

        //open-Tool-detail-button
        jest.spyOn(component, 'openToolDetailDialog');
        jest.spyOn(component.dialog, 'open').mockReturnValue({
            afterClosed: () => of(true),
        } as MatDialogRef<typeof DeploymentDetailComponent>);
        const openToolDetailButton =
            fixture.debugElement.nativeElement.querySelector(
                '.action-button-in-cell'
            );
        openToolDetailButton.click();
        expect(component.openToolDetailDialog).toHaveBeenCalledTimes(1);
        flush();
        discardPeriodicTasks();
    }));

    it('annnounces sort states changes correctly ', fakeAsync(() => {
        const sortState: Sort = {
            active: '',
            direction: 'asc',
        };
        //Announce change in direction
        const spyAnnounce = jest.spyOn(component['_liveAnnouncer'], 'announce');
        component.announceSortChange(sortState);
        sortState.direction = '';
        expect(spyAnnounce).toHaveBeenCalledWith('Sorted ascending');
        //Announce sorted cleared
        component.announceSortChange(sortState);
        expect(spyAnnounce).toHaveBeenCalledWith('Sorting cleared');
    }));

    it('should open tool secrets dialog correctly', fakeAsync(() => {
        component.displayedColumns = [];
        component.ngOnInit();
        tick(100);
        fixture.detectChanges();

        jest.spyOn(component, 'openToolSecretsDialog');
        jest.spyOn(component.dialog, 'open').mockReturnValue({
            afterClosed: () => of(true),
        } as MatDialogRef<typeof SecretManagementDetailComponent>);
        const openToolSecretsButton =
            fixture.debugElement.nativeElement.querySelector('#secrets-button');
        openToolSecretsButton.click();
        expect(component.openToolSecretsDialog).toHaveBeenCalledTimes(1);
        flush();
        discardPeriodicTasks();
    }));
});
