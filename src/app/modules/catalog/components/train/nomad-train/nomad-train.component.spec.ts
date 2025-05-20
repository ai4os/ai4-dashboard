import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomadTrainComponent } from './nomad-train.component';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { StorageConfFormComponent } from '../storage-conf-form/storage-conf-form.component';
import { HardwareConfFormComponent } from '../hardware-conf-form/hardware-conf-form.component';
import { GeneralConfFormComponent } from '../general-conf-form/general-conf-form.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import {
    mockedModuleConfiguration,
    mockedModulesService,
} from '@app/shared/mocks/modules-service.mock';
import { mockedToolsService } from '@app/shared/mocks/tools-service.mock';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { of } from 'rxjs';

describe('NomadTrainComponent', () => {
    let component: NomadTrainComponent;
    let fixture: ComponentFixture<NomadTrainComponent>;
    const mockedConfigService: any = {};

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            declarations: [
                NomadTrainComponent,
                StorageConfFormComponent,
                HardwareConfFormComponent,
                GeneralConfFormComponent,
            ],
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
                OAuthStorage,
                { provide: FormGroupDirective, useValue: formGroupDirective },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: ModulesService, useValue: mockedModulesService },
                { provide: ToolsService, useValue: mockedToolsService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: {
                            params: of({ id: 'test' }),
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NomadTrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load specific module when not in snapshot mode', () => {
        expect(mockedModulesService.getModule).toHaveBeenCalledWith('test');
        expect(
            mockedModulesService.getModuleNomadConfiguration
        ).toHaveBeenCalledWith('test');

        expect(component.generalConfDefaultValues).toEqual(
            mockedModuleConfiguration.general
        );
        expect(component.hardwareConfDefaultValues).toEqual(
            mockedModuleConfiguration.hardware
        );
        expect(component.storageConfDefaultValues).toEqual(
            mockedModuleConfiguration.storage
        );
    });

    it('should load generic module when deploymentType is snapshot', () => {
        sessionStorage.setItem('deploymentType', 'snapshot');
        sessionStorage.setItem(
            'deploymentRow',
            JSON.stringify({
                snapshot_ID: 'snap-001',
                name: 'Snapshot App',
                desc: 'Snapshot Description',
                containerName: 'snapshot-container',
                tagName: 'v1.0.0',
            })
        );

        fixture = TestBed.createComponent(NomadTrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.title).toBe('Snapshots');
        expect(
            mockedModulesService.getModuleNomadConfiguration
        ).toHaveBeenCalledWith('ai4os-demo-app');
        expect(component.generalConfDefaultValues.title.value).toBe(
            'Snapshot App'
        );
        expect(component.generalConfDefaultValues.desc?.value).toContain(
            'snap-001'
        );
        expect(component.generalConfDefaultValues.docker_image.value).toBe(
            'snapshot-container'
        );
        expect(component.generalConfDefaultValues.docker_tag.value).toBe(
            'v1.0.0'
        );
    });

    it('should toggle help state when showHelpButtonChange is triggered', () => {
        component.showHelpButtonChange({ checked: true } as any);
        expect(component.showHelp).toBe(true);

        component.showHelpButtonChange({ checked: false } as any);
        expect(component.showHelp).toBe(false);
    });
});
