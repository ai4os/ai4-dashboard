import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvatComponent } from './cvat.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { provideHttpClient } from '@angular/common/http';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    mockCvatTool,
    mockedCvatConfiguration,
    mockedToolsService,
} from '@app/modules/catalog/services/tools-service/tools-service.mock';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { testProviders } from '@app/shared/testing/test-providers';
import { BreadcrumbService } from 'xng-breadcrumb';
import { MockStepperFormComponent } from '@app/shared/mocks/stepper-form.component.mock';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';

describe('CvatComponent', () => {
    let component: CvatComponent;
    let fixture: ComponentFixture<CvatComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvatComponent],
            providers: [
                ...testProviders,
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: ToolsService, useValue: mockedToolsService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: {
                            params: of({
                                id: 'ai4os-cvat',
                            }),
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
            .overrideComponent(CvatComponent, {
                remove: {
                    imports: [StepperFormComponent],
                },
                add: {
                    imports: [MockStepperFormComponent],
                },
            })
            .compileComponents();

        mockedToolsService.getTool.mockReturnValue(of(mockCvatTool));

        fixture = TestBed.createComponent(CvatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load module data and set title and configurations', () => {
        expect(mockedToolsService.getTool).toHaveBeenCalledWith('ai4os-cvat');
        expect(mockedToolsService.getCvatConfiguration).toHaveBeenCalledWith(
            'ai4os-cvat'
        );

        expect(component.title).toBe('CVAT Image Annotation');
        expect(component.generalConfDefaultValues).toEqual(
            mockedCvatConfiguration.general
        );
        expect(component.storageConfDefaultValues).toEqual(
            mockedCvatConfiguration.storage
        );
    });

    it('should toggle showHelp when help toggle is clicked', () => {
        const toggleEvent = { checked: true } as MatSlideToggleChange;
        component.showHelpButtonChange(toggleEvent);
        expect(component.showHelp).toBe(true);

        component.showHelpButtonChange({
            checked: false,
        } as MatSlideToggleChange);
        expect(component.showHelp).toBe(false);
    });
});
