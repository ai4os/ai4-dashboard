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
import { AuthService } from '@app/core/services/auth/auth.service';
import { of } from 'rxjs';

const mockedProfile = {
    info: {
        exp: 1693908513,
        iat: 1693907913,
        auth_time: 1693907911,
        jti: '00000000-c9e1-44b7-b313-4bde8fba70fa',
        iss: 'https://aai-demo.egi.eu/auth/realms/egi',
        aud: 'ai4eosc-dashboard',
        sub: 'test@egi.eu',
        typ: 'ID',
        azp: 'ai4eosc-dashboard',
        nonce: 'WnVHR3ZpOVoyVlFwcjVGTEtIRWhyUTZ0eXJYVHZxN1M4TX5MRzVKWVJYVHZx',
        session_state: '00000000-818c-46d4-ad87-1b9a1c22c43f',
        at_hash: 'gdEA9VsgdEA9V-mubWhBWw',
        sid: 'b27a9b7a-818c-46d4-ad87-1b9a1818c43f',
        voperson_verified_email: ['test@ifca.unican.es'],
        email_verified: true,
        name: 'AI4EOSC Dasboard Test',
        preferred_username: 'ai4dash',
        eduperson_assurance: [
            'https://refeds.org/assurance/IAP/low',
            'https://aai.egi.eu/LoA#Low',
        ],
        given_name: 'AI4EOSC Dasboard ',
        family_name: 'Test',
        email: 'test@ifca.unican.es',
        eduperson_entitlement: [
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.ai4eosc.eu:role=vm_operator#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=member#aai.egi.eu',
            'urn:mace:egi.eu:group:vo.imagine-ai.eu:role=vm_operator#aai.egi.eu',
        ],
    },
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

const mockedConfigService: any = {};

const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
    userProfileSubject: of({}),
    loadUserProfile: jest.fn().mockReturnValue(Promise.resolve(mockedProfile)),
    login: jest.fn(),
    logout: jest.fn(),
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
                { provide: AuthService, useValue: mockedAuthService },
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
