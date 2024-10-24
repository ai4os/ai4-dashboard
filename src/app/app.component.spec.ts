import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription, of } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from './shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

const mockedConfigService: any = {
    analytics: {
        domain: 'localhost',
        src: 'http://locahost/js/script.js',
    },
};

const mockedCookieConsentService: any = {
    hasConsented: jest.fn().mockReturnValue(true),
    statusChange$: of('test'),
};

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

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    let statusChangeSubscription: Subscription;

    beforeEach(async () => {
        statusChangeSubscription = new Subscription();

        await TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), SharedModule],
            declarations: [AppComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: NgcCookieConsentService,
                    useValue: mockedCookieConsentService,
                },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        component['statusChangeSubscription'] = statusChangeSubscription;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it(`should have as title 'ai4-dashboard'`, () => {
        expect(component.title).toEqual('ai4-dashboard');
    });

    it('unsubscribes when destroyed', () => {
        const unsubscribeSpy = jest.spyOn(
            component['statusChangeSubscription'],
            'unsubscribe'
        );
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });
});
