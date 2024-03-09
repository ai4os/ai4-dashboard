import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputeConfFormComponent } from './compute-conf-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarketplaceModule } from '@app/modules/marketplace/marketplace.module';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/shared/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MediaMatcher } from '@angular/cdk/layout';

describe('ComputeConfFormComponent', () => {
    let component: ComputeConfFormComponent;
    let fixture: ComponentFixture<ComputeConfFormComponent>;
    const mockedConfigService: any = {};

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            declarations: [ComputeConfFormComponent],
            imports: [
                BrowserAnimationsModule,
                MarketplaceModule,
                SharedModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                FormGroupDirective,
                FormBuilder,
                { provide: OAuthStorage, useValue: {} },
                { provide: FormGroupDirective, useValue: formGroupDirective },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ComputeConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
