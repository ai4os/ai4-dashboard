import {
    ComponentFixture,
    discardPeriodicTasks,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';

import { InferencesListComponent } from './inferences-list.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedSnackbarService } from '@app/shared/mocks/snackbar-service.mock';
import { OscarInferenceService } from '../../services/oscar-inference.service';
import { mockedOscarInferenceService } from '@app/shared/mocks/oscar-inference.service.mock';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';

describe('ServicesListComponent', () => {
    let component: InferencesListComponent;
    let fixture: ComponentFixture<InferencesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InferencesListComponent],
            imports: [
                SharedModule,
                NoopAnimationsModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: SnackbarService, useValue: mockedSnackbarService },
                {
                    provide: OscarInferenceService,
                    useValue: mockedOscarInferenceService,
                },
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(InferencesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should populate dataset and stop loading on service success', fakeAsync(() => {
        component.getServicesList();

        tick(100);

        expect(mockedOscarInferenceService.getServices).toHaveBeenCalled();
        expect(component.isLoading).toBe(false);
        expect(component.dataset.length).toBe(2);
        expect(component.dataset[0].name).toBe('Oscar Service Mock Title');

        flush();
        discardPeriodicTasks();
    }));

    it('should remove service and show success snackbar on deletion', () => {
        const uuid = 'mock-uuid';
        component.dataset = [
            {
                uuid,
                name: 'Oscar Service Mock Title',
                containerName: 'oscar-img',
                creationTime: '2023-01-01',
            },
            {
                uuid: 'mock-uuid-2',
                name: 'Mock Title 2',
                containerName: 'oscar-img',
                creationTime: '2023-01-01',
            },
        ];
        component.dataSource = new MatTableDataSource(component.dataset);

        component.removeService(uuid);

        expect(
            mockedOscarInferenceService.deleteServiceByName
        ).toHaveBeenCalledWith(uuid);
        expect(mockedSnackbarService.openSuccess).toHaveBeenCalledWith(
            expect.stringContaining(uuid)
        );
        expect(component.dataset.length).toBe(1);
    });
});
