import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeListComponent } from './ai4life-list.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { SharedModule } from '@app/shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Pipe, PipeTransform } from '@angular/core';

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

@Pipe({ name: 'searchAi4lifeModule' })
class MockSearchPipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('Ai4lifeListComponent', () => {
    let component: Ai4lifeListComponent;
    let fixture: ComponentFixture<Ai4lifeListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4lifeListComponent, MockSearchPipe],
            providers: [
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
            imports: [SharedModule, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4lifeListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
