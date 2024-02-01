import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTrainComponent } from './module-train.component';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageConfFormComponent } from '../storage-conf-form/storage-conf-form.component';
import { HardwareConfFormComponent } from '../hardware-conf-form/hardware-conf-form.component';
import { GeneralConfFormComponent } from '../general-conf-form/general-conf-form.component';
import { MediaMatcher } from '@angular/cdk/layout';

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

describe('ModuleTrainComponent', () => {
    let component: ModuleTrainComponent;
    let fixture: ComponentFixture<ModuleTrainComponent>;
    const mockedConfigService: any = {};

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            declarations: [
                ModuleTrainComponent,
                StorageConfFormComponent,
                HardwareConfFormComponent,
                GeneralConfFormComponent,
            ],
            imports: [
                SharedModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModuleTrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
