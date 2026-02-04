import {
    ComponentFixture,
    discardPeriodicTasks,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';

import { TryMeListComponent } from './try-me-list.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TryMeService } from '../../services/try-me.service';
import { of } from 'rxjs';
import { gradioDeployments } from '../../services/try-me.service.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { By } from '@angular/platform-browser';
import { DeploymentTableRow } from '@app/shared/interfaces/deployment.interface';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const mockedDatasets: Array<DeploymentTableRow> = [
    {
        uuid: '9d7c8b08-904e-11ef-a9af-67eed56a1e49',
        status: 'running',
        name: 'pink_butterfly',
        containerName: 'ai4oshub/dogs-breed-detector:latest',
        creationTime: '10:21:19 22-10-2024',
        endpoints: {
            ui: 'http://ui-9d7c8b08-904e-11ef-a9af-67eed56a1e49.ifca-deployments.cloud.ai4eosc.eu',
        },
    },
    {
        uuid: '9d7c8b08-904e-11ef-a9af-67eed56a1e44',
        status: 'running',
        name: 'blue_whale',
        containerName: 'ai4oshub/dogs-breed-detector:latest',
        creationTime: '10:21:19 22-10-2024',
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
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
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

    it('should DELETE a deployment correctly if no error from API', fakeAsync(() => {
        const expectedDataset = [mockedDatasets[1]];
        component.dataset = mockedDatasets;
        const spyDeleteDeploymentByUUID = jest.spyOn(
            mockedTryMeService,
            'deleteDeploymentByUUID'
        );
        const spySuccessSnackbar = jest.spyOn(
            mockedSnackbarService,
            'openSuccess'
        );
        component.removeTryMe(mockedDatasets[0].uuid);
        expect(spyDeleteDeploymentByUUID).toHaveBeenCalledTimes(1);
        expect(spySuccessSnackbar).toHaveBeenCalledTimes(1);
        expect(component.dataset).toEqual(expectedDataset);
        jest.clearAllMocks();
    }));

    it('should NOT delete a deployment if API returns an error', fakeAsync(() => {
        const spyDeleteDeploymentByUUID = jest
            .spyOn(mockedTryMeService, 'deleteDeploymentByUUID')
            .mockReturnValue(of({ status: 'error' }));
        const spyErrorSnackbar = jest.spyOn(mockedSnackbarService, 'openError');
        component.dataset = mockedDatasets;
        component.removeTryMe(mockedDatasets[0].uuid);
        expect(spyDeleteDeploymentByUUID).toHaveBeenCalledTimes(1);
        expect(spyErrorSnackbar).toHaveBeenCalledTimes(1);
        expect(component.dataset).toEqual(mockedDatasets);
    }));

    it('should open deployment detail dialog correctly', fakeAsync(() => {
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
});
