import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetsListComponent } from './datasets-list.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ZenodoSimpleDataset } from '@app/shared/interfaces/dataset.interface';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import {
    mockedDataset,
    mockedDatasetRow,
} from '@app/shared/mocks/zenodo-service.mock';

describe('DatasetsListComponent', () => {
    let component: DatasetsListComponent;
    let fixture: ComponentFixture<DatasetsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetsListComponent],
            imports: [
                NoopAnimationsModule,
                SharedModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show empty list info', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Header row
        const tableHeaderRow =
            fixture.debugElement.nativeElement.querySelectorAll(
                'mat-header-row'
            );
        expect(tableHeaderRow.length).toBe(1);

        const headerColumns =
            fixture.nativeElement.querySelectorAll('mat-header-cell');
        expect(headerColumns[0].textContent).toContain('NAME');
        expect(headerColumns[1].textContent).toContain('SOURCE');
        expect(headerColumns[2].textContent).toContain('FORCE-PULL');
        expect(headerColumns[3].textContent).toContain('ACTIONS');
        expect(headerColumns.length).toBe(4);

        // Content rows
        const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
        expect(tableRows.length).toBe(0);
        expect(
            compiled.querySelector('.no-datasets-message-container')
        ).toBeTruthy();
    });

    it('should show dataset info', () => {
        // Add dataset
        const dialogRefSpyObj = {
            afterClosed: jest.fn().mockReturnValue(of(true)),
            componentInstance: {
                onSubmitDataset: of(mockedDataset),
                selectedTab: 0,
                dialogLoading: false,
            },
        };

        jest.spyOn(component.confirmationDialog, 'open').mockReturnValue(
            dialogRefSpyObj as any
        );

        // Check datasets
        component.openAddDatasetDialog();
        expect(component.datasets.length).toBe(1);
        expect(component.datasets[0].doi).toBe(mockedDataset.doiOrUrl);
        expect(component.datasets[0].name).toBe(mockedDataset.title);
        expect(component.datasets[0].source).toBe(mockedDataset.source);
        expect(component.datasets[0].forcePull).toBe(mockedDataset.force_pull);

        fixture.detectChanges();

        // Check table
        const tableRows = fixture.debugElement.queryAll(By.css('mat-row'));
        expect(tableRows.length).toBe(1);

        const cells = tableRows[0].queryAll(By.css('mat-cell'));
        expect(cells.length).toBe(component.displayedColumns.length);

        const cellContents = cells.map((cell) =>
            cell.nativeElement.textContent.trim()
        );
        expect(cellContents[0]).toContain(mockedDataset.title);

        const sourceCell = cells.find((cell) =>
            cell.nativeElement.querySelector('img[src$="zenodo-logo.png"]')
        );
        expect(sourceCell).toBeTruthy();

        const forcePullCell = cells.find((cell) =>
            cell.nativeElement.querySelector('mat-checkbox')
        );
        expect(forcePullCell).toBeTruthy();

        const actionCell = cells.find((cell) =>
            cell.nativeElement.querySelector('button')
        );
        expect(actionCell).toBeTruthy();
    });

    it('should delete dataset if user does confirm it', () => {
        // Add dataset
        const mockDataset: ZenodoSimpleDataset = {
            doiOrUrl: '10.1234/example.doi',
            title: 'Example Dataset',
            source: 'zenodo',
            force_pull: false,
        };
        component.datasets = [
            {
                doi: mockDataset.doiOrUrl,
                name: mockDataset.title,
                source: mockDataset.source,
                forcePull: mockDataset.force_pull,
            },
        ];
        component.dataSource = new MatTableDataSource(component.datasets);

        // Spy components
        jest.spyOn(component.confirmationDialog, 'open').mockReturnValue({
            afterClosed: () => of(true),
        } as MatDialogRef<typeof component>);

        // Delete dataset
        const mouseEvent = new MouseEvent('click');
        component.removeDataset(mouseEvent, mockedDatasetRow);
        fixture.detectChanges();

        // Check
        expect(component.datasets.length).toBe(0);
        const tableRows = fixture.debugElement.queryAll(By.css('mat-row'));
        expect(tableRows.length).toBe(0);
    });

    it('should NOT delete dataset if user does not confirm it', () => {
        // Add dataset
        const mockDataset: ZenodoSimpleDataset = {
            doiOrUrl: '10.1234/example.doi',
            title: 'Example Dataset',
            source: 'zenodo',
            force_pull: false,
        };
        component.datasets = [
            {
                doi: mockDataset.doiOrUrl,
                name: mockDataset.title,
                source: mockDataset.source,
                forcePull: mockDataset.force_pull,
            },
        ];
        component.dataSource = new MatTableDataSource(component.datasets);

        // Spy components
        jest.spyOn(component.confirmationDialog, 'open').mockReturnValue({
            afterClosed: () => of(false),
        } as MatDialogRef<typeof component>);

        // Delete dataset
        const mouseEvent = new MouseEvent('click');
        component.removeDataset(mouseEvent, mockedDatasetRow);
        fixture.detectChanges();

        // Check
        expect(component.datasets.length).toBe(1);
        const tableRows = fixture.debugElement.queryAll(By.css('mat-row'));
        expect(tableRows.length).toBe(1);
    });
});
