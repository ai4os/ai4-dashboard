import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription, of } from 'rxjs';

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

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    let statusChangeSubscription: Subscription;

    beforeEach(async () => {
        statusChangeSubscription = new Subscription();

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [AppComponent],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: NgcCookieConsentService,
                    useValue: mockedCookieConsentService,
                },
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
