import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TryMeDetailComponent } from './try-me-detail.component';
import { GradioDeployment } from '@app/shared/interfaces/module.interface';
import { gradioDeployments } from '../../services/try-me.service.mock';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { TryMeService } from '../../services/try-me.service';

const mockedDeployment: GradioDeployment = gradioDeployments[0];

const mockedData = { uuid: '9d7c8b08-904e-11ef-a9af-67eed56a1e49' };

const mockedTryMeService: any = {
    getDeploymentGradioByUUID: jest.fn().mockReturnValue(of(mockedDeployment)),
};

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

describe('TryMeDetailComponent', () => {
    let component: TryMeDetailComponent;
    let fixture: ComponentFixture<TryMeDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TryMeDetailComponent],
            imports: [
                HttpClientTestingModule,
                SharedModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                {
                    provide: TryMeService,
                    useValue: mockedTryMeService,
                },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TryMeDetailComponent);
        component = fixture.componentInstance;
        component.data = mockedData;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not crash if data is undefined or null', () => {
        const nullData: unknown = undefined;
        component.data = nullData as { uuid: string };
        expect(component).toBeTruthy();
    });

    it('should load deployment info correctly', () => {
        const spyGetGradioDeploymentByUUID = jest.spyOn(
            mockedTryMeService,
            'getDeploymentGradioByUUID'
        );
        expect(spyGetGradioDeploymentByUUID).toHaveBeenCalledWith(
            mockedData.uuid
        );
    });
});
