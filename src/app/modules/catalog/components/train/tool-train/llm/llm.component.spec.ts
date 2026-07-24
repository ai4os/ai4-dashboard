import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmComponent } from './llm.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    mockedToolsService,
    mockLlmTool,
} from '@app/modules/catalog/services/tools-service/tools-service.mock';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { of } from 'rxjs';
import { testProviders } from '@app/shared/testing/test-providers';
import { BreadcrumbService } from 'xng-breadcrumb';
import { MockStepperFormComponent } from '@app/shared/mocks/stepper-form.component.mock';
import { StepperFormComponent } from '../../stepper-form/stepper-form.component';

describe('LlmComponent', () => {
    let component: LlmComponent;
    let fixture: ComponentFixture<LlmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LlmComponent, RouterModule.forRoot([])],

            providers: [
                ...testProviders,
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: ToolsService, useValue: mockedToolsService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({}),
                        parent: {
                            params: of({
                                id: 'ai4os-llm',
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
            .overrideComponent(LlmComponent, {
                remove: {
                    imports: [StepperFormComponent],
                },
                add: {
                    imports: [MockStepperFormComponent],
                },
            })
            .compileComponents();

        mockedToolsService.getTool.mockReturnValue(of(mockLlmTool));

        fixture = TestBed.createComponent(LlmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call loadModule and set title and generalConfDefaultValues', () => {
        expect(mockedToolsService.getTool).toHaveBeenCalledWith('ai4os-llm');
        expect(mockedToolsService.getVllmConfiguration).toHaveBeenCalledWith(
            'ai4os-llm'
        );
        expect(component.title).toBe('Deploy your LLM');
        expect(component.generalConfDefaultValues).toHaveProperty('llm');
    });

    it('should update showHelp on slide toggle change', () => {
        const event = { checked: true } as MatSlideToggleChange;
        component.showHelpButtonChange(event);
        expect(component.showHelp).toBe(true);
    });
});
