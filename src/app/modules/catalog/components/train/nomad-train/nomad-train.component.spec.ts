import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomadTrainComponent } from './nomad-train.component';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { StorageConfFormComponent } from '../../conf-forms/storage-conf-form/storage-conf-form.component';
import { HardwareConfFormComponent } from '../../conf-forms/hardware-conf-form/hardware-conf-form.component';
import { GeneralConfFormComponent } from '../../conf-forms/general-conf-form/general-conf-form.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { OAuthStorage } from 'angular-oauth2-oidc';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import {
    mockedModuleConfiguration,
    mockedModulesService,
} from '@app/modules/catalog/services/modules-service/modules-service.mock';
import { mockedToolsService } from '@app/modules/catalog/services/tools-service/tools-service.mock';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { of } from 'rxjs';
import { testProviders } from '@testing/test-providers';
import { BreadcrumbService } from 'xng-breadcrumb';
import { MockStepperFormComponent } from '@app/shared/mocks/stepper-form.component.mock';
import { StepperFormComponent } from '../stepper-form/stepper-form.component';

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
            imports: [
                NomadTrainComponent,
                StorageConfFormComponent,
                HardwareConfFormComponent,
                GeneralConfFormComponent,
                TranslatePipe,
                TranslateDirective,
                RouterModule.forRoot([]),
            ],
            providers: [
                ...testProviders,

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
                {
                    provide: BreadcrumbService,
                    useValue: {
                        set: jest.fn(),
                        get: jest.fn(),
                    },
                },
            ],
        })
            .overrideComponent(NomadTrainComponent, {
                remove: {
                    imports: [StepperFormComponent],
                },
                add: {
                    imports: [MockStepperFormComponent],
                },
            })
            .compileComponents();

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
        component.showHelpButtonChange(true);
        expect(component.showHelp).toBe(true);

        component.showHelpButtonChange(false);
        expect(component.showHelp).toBe(false);
    });
});
