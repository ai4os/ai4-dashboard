import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTrainComponent } from './batch-train.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
    mockedModuleConfiguration,
    mockedModulesService,
} from '@app/modules/catalog/services/modules-service/modules-service.mock';
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import { of } from 'rxjs';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { testProviders } from '@testing/test-providers';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { BreadcrumbService } from 'xng-breadcrumb';
import { StepperFormComponent } from '../stepper-form/stepper-form.component';
import { MockStepperFormComponent } from '@app/shared/mocks/stepper-form.component.mock';

describe('BatchTrainComponent', () => {
    let component: BatchTrainComponent;
    let fixture: ComponentFixture<BatchTrainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BatchTrainComponent, TranslatePipe, TranslateDirective],
            providers: [
                ...testProviders,
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: ModulesService, useValue: mockedModulesService },
                {
                    provide: BreadcrumbService,
                    useValue: {
                        breadcrumbs$: of([]),
                        set: jest.fn(),
                        get: jest.fn(),
                    },
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: {
                            params: of({ id: 'test' }),
                        },
                    },
                },
            ],
        })
            .overrideComponent(BatchTrainComponent, {
                remove: {
                    imports: [StepperFormComponent],
                },
                add: {
                    imports: [MockStepperFormComponent],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(BatchTrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set title and load configurations on init', () => {
        expect(mockedModulesService.getModule).toHaveBeenCalledWith('test');
        expect(
            mockedModulesService.getModuleNomadConfiguration
        ).toHaveBeenCalledWith('test');
        expect(component.title).toBe('Artistic Style Transfer');
        expect(component.generalConfDefaultValues).toEqual(
            mockedModuleConfiguration.general
        );
        expect(component.hardwareConfDefaultValues).toEqual(
            mockedModuleConfiguration.hardware
        );
    });

    it('should toggle help flag on slide toggle change', () => {
        const event = { checked: true } as any;
        component.showHelpButtonChange(event);
        expect(component.showHelp).toBe(true);

        component.showHelpButtonChange({ checked: false } as any);
        expect(component.showHelp).toBe(false);
    });
});
