import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ai4eoscListComponent } from './ai4eosc-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MediaMatcher } from '@angular/cdk/layout';
import { SharedModule } from '@app/shared/shared.module';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Pipe, PipeTransform } from '@angular/core';

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

@Pipe({ name: 'searchAi4eoscModule' })
class MockSearchPipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('AI4EOSCListComponent', () => {
    let component: Ai4eoscListComponent;
    let fixture: ComponentFixture<Ai4eoscListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4eoscListComponent, MockSearchPipe],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
            imports: [SharedModule, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4eoscListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
