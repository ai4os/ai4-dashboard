import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeListComponent } from './ai4life-list.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { SharedModule } from '@app/shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { SearchAi4lifePipe } from '@app/modules/catalog/pipes/search-card-pipe';
import { mockAi4lifeModules } from '@app/shared/mocks/modules-service.mock';

describe('Ai4lifeListComponent', () => {
    let component: Ai4lifeListComponent;
    let fixture: ComponentFixture<Ai4lifeListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4lifeListComponent, SearchAi4lifePipe],
            providers: [
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
            imports: [SharedModule, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4lifeListComponent);
        component = fixture.componentInstance;
        component.modules = mockAi4lifeModules;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form and set resultsFound on init', () => {
        expect(component.searchFormGroup).toBeDefined();
        expect(component.resultsFound).toBe(2);
    });

    it('should update resultsFound when updateResultsFound is called with filter', () => {
        component.searchFormGroup.controls['search'].setValue('Cellpose');
        component.updateResultsFound();

        expect(component.resultsFound).toBe(1);
    });

    it('should show all results when search is empty', () => {
        component.searchFormGroup.controls['search'].setValue('');
        component.updateResultsFound();

        expect(component.resultsFound).toBe(2);
    });
});
