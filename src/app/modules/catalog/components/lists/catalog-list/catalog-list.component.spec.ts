import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogListComponent } from './catalog-list.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SharedModule } from '@app/shared/shared.module';
import { SearchAi4eoscPipe } from '@app/modules/catalog/pipes/search-card-pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import {
    mockDialogRef,
    mockMatDialog,
} from '@app/shared/mocks/mat-dialog.mock';
import { mockModuleSummaryList } from '@app/shared/mocks/modules-service.mock';

describe('CatalogListComponent', () => {
    let component: CatalogListComponent;
    let fixture: ComponentFixture<CatalogListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CatalogListComponent, SearchAi4eoscPipe],
            imports: [SharedModule, NoopAnimationsModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: AppConfigService,
                    useValue: mockedConfigService,
                },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: MatDialog, useValue: mockMatDialog },
            ],
        }).compileComponents();

        sessionStorage.clear();

        fixture = TestBed.createComponent(CatalogListComponent);
        component = fixture.componentInstance;
        component.elements = mockModuleSummaryList;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open the filters configuration dialog', () => {
        mockDialogRef.afterClosed.mockReturnValue(of([]));
        component.openFiltersConfiguration();
        expect(mockMatDialog.open).toHaveBeenCalled();
        expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    });

    it('should update selected filters after dialog is closed', () => {
        const newFilters = [
            {
                libraries: [],
                tasks: [],
                categories: ['AI4 inference'],
                datatypes: [],
                tags: [],
            },
        ];
        mockDialogRef.afterClosed.mockReturnValue(of(newFilters));
        component.openFiltersConfiguration();
        expect(component.selectedFilters).toEqual(newFilters);
    });

    it('should apply dynamic library filter correctly', () => {
        component.filterByLibrary(['PyTorch']);
        expect(component.displayedElements.length).toBe(1);
        expect(component.displayedElements[0].title).toBe('YoloV8 model');
    });

    it('should apply static filters correctly from addFilter', () => {
        component.addFilter({
            libraries: [],
            tasks: [],
            categories: ['AI4 trainable'],
            datatypes: [],
            tags: [],
        });
        expect(component.displayedElements.length).toBe(1);
        expect(component.displayedElements[0].title).toBe('YoloV8 model');
    });

    it('should sort elements by name', () => {
        component.sortBy = 'name';
        component.orderElements();
        expect(component.displayedElements[0].title).toBe(
            'Bird sound classifier'
        );
    });

    it('should sort elements by recent date', () => {
        component.sortBy = 'recent';
        component.orderElements();
        expect(component.displayedElements[0].title).toBe('YoloV8 model');
    });

    it('should reset dynamic filters', () => {
        component.selectedLibraries = ['Other'];
        component.resetFilters();
        expect(component.selectedLibraries).toEqual([]);
    });

    it('should calculate correct number of results after search', () => {
        component.searchFormGroup.controls['search'].setValue(
            'Bird sound classifier'
        );
        const resultCount = component.getNumResults();
        expect(resultCount).toBe(1);
    });

    it('should persist selected filters on destroy', () => {
        const spy = jest.spyOn(sessionStorage.__proto__, 'setItem');
        component.selectedFilters = [
            {
                categories: ['AI4 tools'],
                tasks: [],
                tags: [],
                libraries: [],
                datatypes: [],
            },
        ];

        component.ngOnDestroy();

        expect(spy).toHaveBeenCalledWith(
            'selectedFilters',
            JSON.stringify(component.selectedFilters)
        );
    });
});
