import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeploymentDetailComponent } from './deployment-detail.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { of } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

const mockedDeployment: Deployment = {
    job_ID: 'tool-test',
    status: '',
    owner: '',
    title: '',
    datacenter: 'ai-ifca',
    docker_image: '',
    submit_time: '',
    main_endpoint: '',
    description: '',
};

const mockedConfigService: any = {};
const mockedTranslateService: any = {
    get: jest.fn(),
};
const mockedDeploymentServices: any = {
    getToolByUUID: jest.fn().mockReturnValue(of(mockedDeployment)),
    getDeploymentByUUID: jest.fn().mockReturnValue(of(mockedDeployment)),
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

describe('DeploymentDetailComponent', () => {
    let component: DeploymentDetailComponent;
    let fixture: ComponentFixture<DeploymentDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeploymentDetailComponent],
            imports: [
                RouterModule.forRoot([]),
                TranslateModule.forRoot(),
                MaterialModule,
                SharedModule,
                BrowserModule,
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                {
                    provide: DeploymentsService,
                    useValue: mockedDeploymentServices,
                },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeploymentDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not crash if data is undefined or null', () => {
        const nullData: unknown = undefined;
        component.data = nullData as { uuid: 'string'; isTool: boolean };
        expect(component).toBeTruthy();
    });

    it('should load tool deployment info correctly', () => {
        const mockedData = { uuid: 'tool-test', isTool: true };
        component.data = mockedData;
        const spyGetToolByUUID = jest.spyOn(
            mockedDeploymentServices,
            'getToolByUUID'
        );
        component.ngOnInit();
        expect(spyGetToolByUUID).toHaveBeenCalledWith(mockedData.uuid);
        // Deployment has an error
        mockedDeployment.error_msg = 'I have an error';
        component.ngOnInit();
        expect(component['deploymentHasError']).toBe(true);
    });

    it('should load module deployment info correctly', () => {
        const mockedData = { uuid: 'deployment-test', isTool: false };
        mockedDeployment.description = '';
        component.data = mockedData;
        const spyGetDeploymentByUUID = jest.spyOn(
            mockedDeploymentServices,
            'getDeploymentByUUID'
        );
        component.ngOnInit();
        expect(spyGetDeploymentByUUID).toHaveBeenCalledWith(mockedData.uuid);
    });
});
