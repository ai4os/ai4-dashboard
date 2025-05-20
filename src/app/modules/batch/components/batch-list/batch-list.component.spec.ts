import {
    ComponentFixture,
    discardPeriodicTasks,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';

import { BatchListComponent } from './batch-list.component';
import { mockedSnackbarService } from '@app/shared/services/snackbar/snackbar-service.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { BatchService } from '../../services/batch.service';
import {
    expectedModulesDataset,
    mockedBatchService,
} from '../../services/batch.service.mock';
import { throwError } from 'rxjs';

describe('BatchListComponent', () => {
    let component: BatchListComponent;
    let fixture: ComponentFixture<BatchListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BatchListComponent],
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
                { provide: SnackbarService, useValue: mockedSnackbarService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: BatchService, useValue: mockedBatchService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BatchListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call getServicesList() and populate dataset', fakeAsync(() => {
        component.ngOnInit();
        tick(100);
        expect(component.dataset.length).toBe(2);
        expect(component.dataSource.filteredData.length).toBe(2);
        expect(component.isLoading).toBe(false);

        discardPeriodicTasks();
        flush();
    }));

    it('should handle error in getServicesList()', fakeAsync(() => {
        mockedBatchService.getBatchDeployments.mockReturnValue(
            throwError(() => new Error('API error'))
        );

        component.ngOnInit();
        tick(100);
        expect(component.dataSource.filteredData.length).toBe(0);
        expect(component.isLoading).toBe(false);

        discardPeriodicTasks();
        flush();
    }));

    it('should delete batch deployment successfully', fakeAsync(() => {
        const uuid = '3639771e-35c1-11ee-867a-0242ac110002';
        const snackbarSpy = jest.spyOn(mockedSnackbarService, 'openSuccess');
        component.dataset = JSON.parse(JSON.stringify(expectedModulesDataset));

        component.removeBatchDeployment(uuid);

        tick(100);
        expect(component.dataset.length).toBe(1);
        expect(snackbarSpy).toHaveBeenCalledWith(
            `Successfully deleted batch deployment with uuid: ${uuid}`
        );

        flush();
    }));

    it('should handle error on delete batch deployment', fakeAsync(() => {
        const uuid = '3639771e-35c1-11ee-867a-0242ac110002';
        component.dataset = JSON.parse(JSON.stringify(expectedModulesDataset));
        mockedBatchService.deleteBatchDeploymentByUUID.mockReturnValue(
            throwError(() => new Error('delete error'))
        );
        const snackbarSpy = jest.spyOn(mockedSnackbarService, 'openError');

        component.removeBatchDeployment(uuid);

        tick(100);
        expect(component.dataset.length).toBe(2);
        expect(snackbarSpy).toHaveBeenCalledWith(
            `Error deleting batch deployment with uuid: ${uuid}`
        );

        flush();
    }));
});
