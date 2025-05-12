import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import { LlmsListComponent } from './llms-list.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    mockedToolsService,
    mockedToolsServiceWithError,
    mockedVllmsConfig,
} from '@app/shared/mocks/tools-service.mock';
import { SearchLlmsPipe } from '@app/modules/catalog/pipes/search-card-pipe';

describe('LlmsListComponent', () => {
    let component: LlmsListComponent;
    let fixture: ComponentFixture<LlmsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LlmsListComponent, SearchLlmsPipe],
            imports: [TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: ToolsService, useValue: mockedToolsService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LlmsListComponent);
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

    it('should initialize form with empty search field', () => {
        expect(component.searchFormGroup).toBeDefined();
        expect(component.searchFormGroup.controls['search'].value).toBe('');
    });

    it('should load LLMs on init', () => {
        expect(mockedToolsService.getVllmModelConfiguration).toHaveBeenCalled();
        expect(component.llms).toEqual(mockedVllmsConfig);
        expect(component.resultsFound).toBe(mockedVllmsConfig.length);
        expect(component.llmsLoading).toBe(false);
    });

    it('should update resultsFound based on search input', () => {
        component.searchFormGroup.controls['search'].setValue('Qwen');
        component.updateResultsFound();
        expect(component.resultsFound).toBeGreaterThan(0);
    });

    it('should handle error when loading LLMs', fakeAsync(() => {
        // Reconfigure with error service
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [LlmsListComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                {
                    provide: ToolsService,
                    useValue: mockedToolsServiceWithError,
                },
            ],
        }).compileComponents();

        const errorFixture = TestBed.createComponent(LlmsListComponent);
        const errorComponent = errorFixture.componentInstance;

        errorComponent.getLLMs();
        expect(errorComponent.llmsLoading).toBe(true);

        tick(3000); // simulate delay
        expect(errorComponent.llmsLoading).toBe(false);
    }));
});
