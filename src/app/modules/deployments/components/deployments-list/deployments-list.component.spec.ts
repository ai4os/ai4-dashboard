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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    Deployment,
    statusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { of } from 'rxjs';
import { DeploymentsService } from '../../services/deployments.service';
import { ToolsTableComponent } from './tools-table/tools-table.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { BrowserModule, By } from '@angular/platform-browser';
import { DeploymentDetailComponent } from '../deployment-detail/deployment-detail.component';

const mockedDeployment: Deployment = {
    job_ID: 'tool-test',
    status: '',
    owner: '',
    title: '',
    docker_image: '',
    submit_time: '',
    main_endpoint: '',
    description: '',
    error_msg: 'Test error',
    resources: {
        cpu_MHz: 0,
        cpu_num: 0,
        gpu_num: 1,
        memory_MB: 10,
        disk_MB: 20,
    },
};
const deploymentRow = {
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

const mockedDeleteDeploymentResponse: statusReturn = {
    status: 'success',
};

const mockedConfigService: any = {};
const mockedDeploymentServices: any = {
    getDeployments: jest.fn().mockReturnValue(of([mockedDeployment])),
    getDeploymentByUUID: jest.fn().mockReturnValue(of(mockedDeployment)),
    deleteDeploymentByUUID: jest
        .fn()
        .mockReturnValue(of(mockedDeleteDeploymentResponse)),
};

describe('DeploymentsListComponent', () => {
    let component: DeploymentsListComponent;
    let fixture: ComponentFixture<DeploymentsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DeploymentsListComponent,
                ToolsTableComponent,
                DeploymentDetailComponent,
            ],
            imports: [
                SharedModule,
                BrowserModule,
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
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeploymentsListComponent);
        component = fixture.componentInstance;
        component.dataset = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get deployment list correctly', fakeAsync(() => {
        const spyGetDeploymentsList = jest.spyOn(
            component,
            'getDeploymentsList'
        );
        const spyGetDeploymentsService = jest.spyOn(
            mockedDeploymentServices,
            'getDeployments'
        );

        const expectedDataset = [
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
        ];
        component.ngOnInit();
        tick(100);
        expect(spyGetDeploymentsList).toHaveBeenCalledTimes(1);
        expect(spyGetDeploymentsService).toHaveBeenCalled();
        expect(component.dataset).toEqual(expectedDataset);
        expect(component.dataSource.filteredData).toEqual(expectedDataset);
        flush();
        discardPeriodicTasks();
    }));

    it('should call confirmation dialog when trying to delete a deployment', fakeAsync(() => {
        const mouseEvent = new MouseEvent('click');
        const spyConfirmationDialog = jest.spyOn(
            component.confirmationDialog,
            'open'
        );
        component.removeDeployment(mouseEvent, deploymentRow);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
    }));

    it('should NOT delete a deployment if user does not confirm it', fakeAsync(() => {
        const mouseEvent = new MouseEvent('click');
        const spyConfirmationDialog = jest
            .spyOn(component.confirmationDialog, 'open')
            .mockReturnValue({ afterClosed: () => of(false) } as MatDialogRef<
                typeof component
            >);
        const spyDeleteDeploymentByUUID = jest.spyOn(
            mockedDeploymentServices,
            'deleteDeploymentByUUID'
        );
        component.removeDeployment(mouseEvent, deploymentRow);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteDeploymentByUUID).toHaveBeenCalledTimes(0);
    }));

    it('should DELETE a deployment correctly if confirmed and no error from API', fakeAsync(() => {
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
        const spyDeleteDeploymentByUUID = jest.spyOn(
            mockedDeploymentServices,
            'deleteDeploymentByUUID'
        );
        const spySnackBar = jest.spyOn(component['_snackBar'], 'open');
        component.removeDeployment(mouseEvent, deploymentRow);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteDeploymentByUUID).toHaveBeenCalledTimes(1);
        expect(spySnackBar).toHaveBeenCalledWith(
            'Successfully deleted deployment with uuid: tool-test',
            'X',
            expect.objectContaining({
                duration: 3000,
                panelClass: ['primary-snackbar'],
            })
        );
        expect(component.dataset).toEqual(expectedDataset);
        jest.clearAllMocks();
    }));

    it('should NOT delete a deployment if API returns an error', fakeAsync(() => {
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
        const spyDeleteDeploymentByUUID = jest
            .spyOn(mockedDeploymentServices, 'deleteDeploymentByUUID')
            .mockReturnValue(of({ status: 'error' }));
        const spySnackBar = jest.spyOn(component['_snackBar'], 'open');
        component.dataset = initialDataset;
        component.removeDeployment(mouseEvent, deploymentRow);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteDeploymentByUUID).toHaveBeenCalledTimes(1);
        expect(spySnackBar).toHaveBeenCalledWith(
            'Error deleting deployment with uuid: tool-test',
            'X',
            expect.objectContaining({
                duration: 3000,
                panelClass: ['red-snackbar'],
            })
        );
        expect(component.dataset).toEqual(initialDataset);
    }));

    it('should return correctly a deployments status of running', () => {
        // Check deployment runnning
        let deploymentStatus = component.isDeploymentRunning(deploymentRow);
        expect(deploymentStatus).toBe(true);
        // Check deployment status is empty
        deploymentRow.status = '';
        deploymentStatus = component.isDeploymentRunning(deploymentRow);
        expect(deploymentStatus).toBe(false);
        // Check deployment status is random string
        deploymentRow.status = 'dasdadasdnotrunning';
        deploymentStatus = component.isDeploymentRunning(deploymentRow);
        expect(deploymentStatus).toBe(false);
    });

    it('should return correctly a deployments endpoints', () => {
        //Endpoints undefined, should not crash
        component.getDeploymentEndpoints(deploymentRow);
        expect(component).toBeTruthy();
        //Endpoints are returned correctly
        const expectedEndpoints = {
            test: 'test',
        };
        deploymentRow.endpoints = expectedEndpoints;
        const endpoints = component.getDeploymentEndpoints(deploymentRow);
        expect(endpoints).toEqual(expectedEndpoints);
    });

    it('should return correctly a deployments error, if any', () => {
        //Error undefined, should not crash
        const nullData: unknown = undefined;
        deploymentRow.error_msg = nullData as string;
        component.hasDeploymentErrors(deploymentRow);
        expect(component).toBeTruthy();
        //Errors are returned correctly
        deploymentRow.error_msg = 'Something failed';
        const errorMsg = component.hasDeploymentErrors(deploymentRow);
        expect(errorMsg).toEqual('Something failed');
    });

    it('should return correctly a deployments badge correctly', () => {
        //Status undefined, should not crash
        const nullData: unknown = undefined;
        component.returnDeploymentBadge(nullData as string);
        jest.spyOn(component, 'returnDeploymentBadge');
        expect(component.returnDeploymentBadge).toReturn;
        const badge = component.returnDeploymentBadge('running');
        expect(badge).toEqual('running-brightgreen');
    });

    it('should open deployment detail dialog correctly', fakeAsync(() => {
        component.displayedColumns = [];
        component.ngOnInit();
        tick(100);
        fixture.detectChanges();

        //open-deployment-detail-button
        jest.spyOn(component, 'openDeploymentDetailDialog');
        const openDeploymentDetailButton = fixture.debugElement.query(
            By.css('#infoButton')
        ).nativeElement;
        openDeploymentDetailButton.click();
        expect(component.openDeploymentDetailDialog).toHaveBeenCalledTimes(1);
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
});
