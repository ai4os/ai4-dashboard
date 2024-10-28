import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetCreationDetailComponent } from './dataset-creation-detail.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
    ZenodoCommunity,
    ZenodoSimpleDataset,
} from '@app/shared/interfaces/dataset.interface';
import { By } from '@angular/platform-browser';
import { ZenodoService } from '@app/modules/marketplace/services/zenodo-service/zenodo.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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

const mockedCommunities: ZenodoCommunity = {
    id: '1',
    title: 'https://zenodo.org/communities/test',
    link: 'Community Test',
};

const mockedDataset: ZenodoSimpleDataset = {
    doiOrUrl: '10.1234/example',
    title: 'Example Dataset',
    source: 'zenodo',
    force_pull: false,
};

const mockedZenodoService: any = {
    getCommunities: jest.fn().mockReturnValue(of(mockedCommunities)),
    getDataset: jest.fn().mockReturnValue(of(mockedDataset)),
};

describe('DatasetCreationDetailComponent', () => {
    let component: DatasetCreationDetailComponent;
    let fixture: ComponentFixture<DatasetCreationDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetCreationDetailComponent],
            imports: [
                SharedModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: ZenodoService, useValue: mockedZenodoService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetCreationDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add a dataset via zenodo', () => {
        component.selectedTab = 0;
        component.dialogLoading = false;

        const spyAddDataset = jest.spyOn(component, 'addDataset');
        const addButton = fixture.debugElement.query(By.css('#add-button'));
        expect(addButton.nativeElement.disabled).toBeTruthy();

        component.zenodoFormGroup.setValue({
            zenodoCommunitySelect: 'CommunityTest',
            zenodoDatasetSelect: 'Example Dataset',
            zenodoVersionSelect: '1',
        });
        fixture.detectChanges();
        expect(addButton.nativeElement.disabled).toBeFalsy();

        addButton.nativeElement.click();
        fixture.detectChanges();
        expect(spyAddDataset).toHaveBeenCalledTimes(1);
    });

    it('should add dataset via DOI', () => {
        component.selectedTab = 1;
        component.dialogLoading = false;

        const spyAddDataset = jest.spyOn(component, 'addDataset');
        const addButton = fixture.debugElement.query(By.css('#add-button'));
        expect(addButton.nativeElement.disabled).toBeTruthy();

        component.doiUrlFormGroup.setValue({
            doiUrlInput: mockedDataset.doiOrUrl,
        });
        fixture.detectChanges();
        expect(addButton.nativeElement.disabled).toBeFalsy();

        addButton.nativeElement.click();
        fixture.detectChanges();
        expect(spyAddDataset).toHaveBeenCalledTimes(1);
    });

    it('should NOT add a dataset if DOI is invalid', () => {
        component.selectedTab = 1;
        component.dialogLoading = false;

        const addButton = fixture.debugElement.query(By.css('#add-button'));
        expect(addButton.nativeElement.disabled).toBeTruthy();

        component.doiUrlFormGroup.setValue({ doiUrlInput: 'abc' });
        fixture.detectChanges();
        expect(addButton.nativeElement.disabled).toBeTruthy();
    });
});
