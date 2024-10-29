import {
    ComponentFixture,
    discardPeriodicTasks,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';

import { TryMeListComponent } from './try-me-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TryMeService } from '../../services/try-me.service';
import { of } from 'rxjs';
import { gradioDeployments } from '../../services/try-me.service.mock';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { By } from '@angular/platform-browser';
import { Sort } from '@angular/material/sort';

const mockedDatasets = [
    {
        uuid: '9d7c8b08-904e-11ef-a9af-67eed56a1e49',
        name: 'try-9d7c8b08-904e-11ef-a9af-67eed56a1e49',
        status: 'running',
        title: 'pink_butterfly',
        image: 'ai4oshub/dogs-breed-detector:latest',
        creationTime: '2024-10-22 10:21:19',
        endpoints: {
            ui: 'http://ui-9d7c8b08-904e-11ef-a9af-67eed56a1e49.ifca-deployments.cloud.ai4eosc.eu',
        },
    },
    {
        uuid: '9d7c8b08-904e-11ef-a9af-67eed56a1e44',
        name: 'try-9d7c8b08-904e-11ef-a9af-67eed56a1e44',
        status: 'running',
        title: 'blue_whale',
        image: 'ai4oshub/dogs-breed-detector:latest',
        creationTime: '2024-10-22 10:21:19',
        endpoints: {
            ui: 'http://ui-9d7c8b08-904e-11ef-a9af-67eed56a1e49.ifca-deployments.cloud.ai4eosc.eu',
        },
    },
];

const mockedTryMeService: any = {
    getDeploymentsGradio: jest
        .fn()
        .mockReturnValueOnce(of([]))
        .mockReturnValue(of(gradioDeployments)),
    deleteDeploymentByUUID: jest
        .fn()
        .mockReturnValue(of({ status: 'success' })),
};

const mockedConfigService: any = {};

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

describe('TryMeListComponent', () => {
    let component: TryMeListComponent;
    let fixture: ComponentFixture<TryMeListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TryMeListComponent],
            imports: [
                SharedModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: TryMeService,
                    useValue: mockedTryMeService,
                },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                {
                    provide: SnackbarService,
                    useValue: mockedSnackbarService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TryMeListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show empty deployments list correctly', fakeAsync(() => {
        const spyGetTryMeDeploymentsList = jest.spyOn(
            component,
            'getTryMeDeploymentsList'
        );
        const spyGetGradioDeploymentsService = jest.spyOn(
            mockedTryMeService,
            'getDeploymentsGradio'
        );

        component.ngOnInit();
        tick(100);
        expect(spyGetTryMeDeploymentsList).toHaveBeenCalledTimes(1);
        expect(spyGetGradioDeploymentsService).toHaveBeenCalled();
        expect(component.dataset).toEqual([]);
        expect(component.dataSource.filteredData).toEqual([]);
        flush();
        discardPeriodicTasks();
    }));

    it('should show deployments list correctly', fakeAsync(() => {
        const spyGetTryMeDeploymentsList = jest.spyOn(
            component,
            'getTryMeDeploymentsList'
        );
        const spyGetGradioDeploymentsService = jest.spyOn(
            mockedTryMeService,
            'getDeploymentsGradio'
        );

        const expectedDatasets = mockedDatasets;
        component.ngOnInit();
        tick(100);
        expect(spyGetTryMeDeploymentsList).toHaveBeenCalledTimes(1);
        expect(spyGetGradioDeploymentsService).toHaveBeenCalled();
        expect(component.dataset).toEqual(expectedDatasets);
        expect(component.dataSource.filteredData).toEqual(expectedDatasets);
        flush();
        discardPeriodicTasks();
    }));

    it('should call confirmation dialog when trying to delete a deployment', fakeAsync(() => {
        const mouseEvent = new MouseEvent('click');
        const spyConfirmationDialog = jest.spyOn(
            component.confirmationDialog,
            'open'
        );
        component.removeTryMe(mouseEvent, mockedDatasets[0]);
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
            mockedTryMeService,
            'deleteDeploymentByUUID'
        );
        component.removeTryMe(mouseEvent, mockedDatasets[0]);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteDeploymentByUUID).toHaveBeenCalledTimes(0);
    }));

    it('should DELETE a deployment correctly if confirmed and no error from API', fakeAsync(() => {
        const expectedDataset = [mockedDatasets[1]];
        component.dataset = mockedDatasets;
        const mouseEvent = new MouseEvent('click');
        const spyConfirmationDialog = jest
            .spyOn(component.confirmationDialog, 'open')
            .mockReturnValue({ afterClosed: () => of(true) } as MatDialogRef<
                typeof component
            >);
        const spyDeleteDeploymentByUUID = jest.spyOn(
            mockedTryMeService,
            'deleteDeploymentByUUID'
        );
        const spySuccessSnackbar = jest.spyOn(
            mockedSnackbarService,
            'openSuccess'
        );
        component.removeTryMe(mouseEvent, mockedDatasets[0]);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteDeploymentByUUID).toHaveBeenCalledTimes(1);
        expect(spySuccessSnackbar).toHaveBeenCalledTimes(1);
        expect(component.dataset).toEqual(expectedDataset);
        jest.clearAllMocks();
    }));

    it('should NOT delete a deployment if API returns an error', fakeAsync(() => {
        const mouseEvent = new MouseEvent('click');
        const spyConfirmationDialog = jest
            .spyOn(component.confirmationDialog, 'open')
            .mockReturnValue({ afterClosed: () => of(true) } as MatDialogRef<
                typeof component
            >);
        const spyDeleteDeploymentByUUID = jest
            .spyOn(mockedTryMeService, 'deleteDeploymentByUUID')
            .mockReturnValue(of({ status: 'error' }));
        const spyErrorSnackbar = jest.spyOn(mockedSnackbarService, 'openError');
        component.dataset = mockedDatasets;
        component.removeTryMe(mouseEvent, mockedDatasets[0]);
        expect(spyConfirmationDialog).toHaveBeenCalledTimes(1);
        expect(spyDeleteDeploymentByUUID).toHaveBeenCalledTimes(1);
        expect(spyErrorSnackbar).toHaveBeenCalledTimes(1);
        expect(component.dataset).toEqual(mockedDatasets);
    }));

    it('should return correctly a deployments status of running', () => {
        // Check deployment runnning
        let deploymentStatus = component.isDeploymentRunning(mockedDatasets[0]);
        expect(deploymentStatus).toBe(true);
        // Check deployment status is empty
        mockedDatasets[0].status = '';
        deploymentStatus = component.isDeploymentRunning(mockedDatasets[0]);
        expect(deploymentStatus).toBe(false);
        // Check deployment status is random string
        mockedDatasets[0].status = 'notrunningnow';
        deploymentStatus = component.isDeploymentRunning(mockedDatasets[0]);
        expect(deploymentStatus).toBe(false);
    });

    it('should return correctly a deployments badge correctly', () => {
        const nullData: unknown = undefined;
        jest.spyOn(component, 'returnDeploymentBadge');
        component.returnDeploymentBadge(nullData as string);
        expect(component.returnDeploymentBadge).toHaveReturned();
        const badge = component.returnDeploymentBadge('running');
        expect(badge).toEqual('running-brightgreen');
    });

    it('should open deployment detail dialog correctly', fakeAsync(() => {
        component.displayedColumns = [];
        component.ngOnInit();
        tick(100);
        fixture.detectChanges();

        jest.spyOn(component, 'openTryMeDetailDialog');
        const openDeploymentDetailButton = fixture.debugElement.query(
            By.css('#infoButton')
        ).nativeElement;

        openDeploymentDetailButton.click();
        expect(component.openTryMeDetailDialog).toHaveBeenCalledTimes(1);
        flush();
        discardPeriodicTasks();
    }));

    it('annnounces sort states changes correctly ', fakeAsync(() => {
        const sortState: Sort = {
            active: '',
            direction: 'asc',
        };
        // Announce change in direction
        const spyAnnounce = jest.spyOn(component['_liveAnnouncer'], 'announce');
        component.announceSortChange(sortState);
        sortState.direction = '';
        expect(spyAnnounce).toHaveBeenCalledWith('Sorted ascending');
        // Announce sorted cleared
        component.announceSortChange(sortState);
        expect(spyAnnounce).toHaveBeenCalledWith('Sorting cleared');
    }));
});
