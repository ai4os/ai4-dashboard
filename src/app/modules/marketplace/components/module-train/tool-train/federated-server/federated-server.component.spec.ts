import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FederatedServerComponent } from './federated-server.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SharedModule } from '@app/shared/shared.module';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FederatedConfFormComponent } from './federated-conf-form/federated-conf-form.component';
import { HardwareConfFormComponent } from '../../hardware-conf-form/hardware-conf-form.component';
import { GeneralConfFormComponent } from '../../general-conf-form/general-conf-form.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

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

const mockedConfigService: any = {};

const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

describe('FederatedServerComponent', () => {
    let component: FederatedServerComponent;
    let fixture: ComponentFixture<FederatedServerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SharedModule,
                RouterModule.forRoot([]),
                BrowserAnimationsModule,
                TranslateModule.forRoot(),
            ],
            declarations: [
                FederatedServerComponent,
                StepperFormComponent,
                FederatedConfFormComponent,
                HardwareConfFormComponent,
                GeneralConfFormComponent,
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FederatedServerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
