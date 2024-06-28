import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetCreationDetailComponent } from './dataset-creation-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

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

describe('DatasetCreationDetailComponent', () => {
    let component: DatasetCreationDetailComponent;
    let fixture: ComponentFixture<DatasetCreationDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetCreationDetailComponent],
            imports: [
                SharedModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetCreationDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
