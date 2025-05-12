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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { of } from 'rxjs';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedAuthService } from '@app/shared/mocks/auth-service.mock';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import {
    mockedFedServerConfiguration,
    mockedToolsService,
    mockFedServerTool,
} from '@app/shared/mocks/tools-service.mock';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';

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
                { provide: ToolsService, useValue: mockedToolsService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: {
                            params: of({ id: 'ai4os-federated-server' }),
                        },
                        params: of({ id: 'ai4os-federated-server' }),
                        snapshot: {
                            routeConfig: {},
                        },
                    },
                },
            ],
        }).compileComponents();

        mockedToolsService.getTool.mockReturnValue(of(mockFedServerTool));

        fixture = TestBed.createComponent(FederatedServerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load tool and federated server configuration on init', () => {
        expect(mockedToolsService.getTool).toHaveBeenCalledWith(
            'ai4os-federated-server'
        );
        expect(
            mockedToolsService.getFederatedServerConfiguration
        ).toHaveBeenCalledWith('ai4os-federated-server');

        expect(component.title).toBe('Federated learning with Flower');
        expect(component.generalConfDefaultValues).toEqual(
            mockedFedServerConfiguration.general
        );
        expect(component.hardwareConfDefaultValues).toEqual(
            mockedFedServerConfiguration.hardware
        );
        expect(component.federatedConfDefaultValues).toEqual(
            mockedFedServerConfiguration.flower
        );
    });

    it('should toggle showHelp when showHelpButtonChange is triggered', () => {
        const toggleOn = { checked: true } as MatSlideToggleChange;
        const toggleOff = { checked: false } as MatSlideToggleChange;

        component.showHelpButtonChange(toggleOn);
        expect(component.showHelp).toBe(true);

        component.showHelpButtonChange(toggleOff);
        expect(component.showHelp).toBe(false);
    });
});
