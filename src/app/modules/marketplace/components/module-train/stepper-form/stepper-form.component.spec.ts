import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperFormComponent } from './stepper-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { FormGroupDirective, FormBuilder, FormGroup } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
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

const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

const mockedConfigService: any = {};

describe('StepperFormComponent', () => {
    let component: StepperFormComponent;
    let fixture: ComponentFixture<StepperFormComponent>;

    beforeEach(async () => {
        const formGroupDirective = new FormGroupDirective([], []);
        await TestBed.configureTestingModule({
            declarations: [StepperFormComponent],
            imports: [
                SharedModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                RouterModule.forRoot([]),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StepperFormComponent);
        component = fixture.componentInstance;
        component.step1Form = new FormGroup([]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
