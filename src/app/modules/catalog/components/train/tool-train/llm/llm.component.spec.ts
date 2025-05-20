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

describe('LlmComponent', () => {
    let component: LlmComponent;
    let fixture: ComponentFixture<LlmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([])],
            declarations: [LlmComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: ToolsService, useValue: mockedToolsService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: {
                            params: of({
                                id: 'ai4os-llm',
                            }),
                        },
                    },
                },
            ],
        }).compileComponents();

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
