import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
    StorageConfFormComponent,
    urlValidator,
} from './storage-conf-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroupDirective } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';

describe('StorageConfFormComponent', () => {
    let component: StorageConfFormComponent;
    let fixture: ComponentFixture<StorageConfFormComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            declarations: [StorageConfFormComponent],
            imports: [
                SharedModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({
                            id: 'test',
                        }),
                        snapshot: {
                            paramMap: {
                                get: () => 'test',
                            },
                        },
                        routeConfig: { path: 'test' },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StorageConfFormComponent);
        component = fixture.componentInstance;
        component.showHelp = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should validate URL correctly', () => {
        const validator = urlValidator();
        const validControl = new FormControl('https://example.com');
        const invalidControl = new FormControl('notaurl');

        expect(validator(validControl)).toBeNull();
        expect(validator(invalidControl)).toEqual({ invalidURL: true });
    });

    it('should add dataset and apply required validators', () => {
        const dataset = {
            doiOrUrl: '10.5281/zenodo.1234567',
            title: 'Test Dataset',
            source: 'http',
            force_pull: false,
        };
        component.addDataset(dataset);
        expect(component.datasets.length).toBe(1);

        const storageServiceDataset = component.storageConfFormGroup.get(
            'storageServiceDatasetSelect'
        );
        expect(storageServiceDataset?.validator).toBeTruthy();
    });

    it('should remove dataset and clear validators if empty', () => {
        const dataset = {
            doiOrUrl: '10.5281/zenodo.1234567',
            title: 'Test Dataset',
            source: 'http',
            force_pull: false,
        };
        component.addDataset(dataset);
        component.deleteDataset(dataset);

        expect(component.datasets.length).toBe(0);

        const storageServiceDataset = component.storageConfFormGroup.get(
            'storageServiceDatasetSelect'
        );
        expect(storageServiceDataset?.validator).toBeNull();
    });
});
