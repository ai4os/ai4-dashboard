import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogListComponent } from './catalog-list.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SharedModule } from '@app/shared/shared.module';
import { SearchAi4eoscPipe } from '@app/modules/catalog/pipes/search-card-pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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

const mockedConfigService: any = {};

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
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CatalogListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
