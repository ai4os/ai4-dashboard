import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeListComponent } from './ai4life-list.component';
import { SearchAi4lifePipe } from '@app/modules/catalog/pipes/search-card-pipe';
import { mockAi4lifeModules } from '@app/modules/catalog/services/modules-service/modules-service.mock';
import { testProviders } from '@app/shared/testing/test-providers';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

describe('Ai4lifeListComponent', () => {
    let component: Ai4lifeListComponent;
    let fixture: ComponentFixture<Ai4lifeListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Ai4lifeListComponent, SearchAi4lifePipe],
            providers: [
                ...testProviders,
                {
                    provide: AppConfigService,
                    useValue: mockedConfigService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4lifeListComponent);
        component = fixture.componentInstance;
        //component.modules = mockAi4lifeModules;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form and set resultsFound on init', () => {
        // TODO: redo
        // expect(component.searchFormGroup).toBeDefined();
        // expect(component.resultsFound).toBe(2);
    });

    it('should update resultsFound when updateResultsFound is called with filter', () => {
        // TODO: redo
        // component.searchFormGroup.controls['search'].setValue('Cellpose');
        // component.updateResultsFound();
        // expect(component.resultsFound).toBe(1);
    });

    it('should show all results when search is empty', () => {
        // TODO: redo
        // component.searchFormGroup.controls['search'].setValue('');
        // component.updateResultsFound();
        // expect(component.resultsFound).toBe(2);
    });
});
