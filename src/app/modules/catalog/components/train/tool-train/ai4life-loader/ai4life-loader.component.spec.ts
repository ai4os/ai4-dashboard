import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeLoaderComponent } from './ai4life-loader.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    mockAi4lifeTool,
    mockedToolsService,
} from '@app/shared/mocks/tools-service.mock';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { of } from 'rxjs';

describe('Ai4lifeLoaderComponent', () => {
    let component: Ai4lifeLoaderComponent;
    let fixture: ComponentFixture<Ai4lifeLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4lifeLoaderComponent],
            imports: [RouterModule.forRoot([])],
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
                                id: 'ai4os-ai4life-loader',
                            }),
                        },
                    },
                },
            ],
        }).compileComponents();

        mockedToolsService.getTool.mockReturnValue(of(mockAi4lifeTool));

        fixture = TestBed.createComponent(Ai4lifeLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load tool data', () => {
        component.ngOnInit();

        expect(mockedToolsService.getTool).toHaveBeenCalledWith(
            'ai4os-ai4life-loader'
        );
        expect(mockedToolsService.getAi4LifeConfiguration).toHaveBeenCalledWith(
            'ai4os-ai4life-loader'
        );
        expect(component.title).toBe('AI4life model loader');
    });

    it('should update showHelp on toggle', () => {
        const event = { checked: true } as MatSlideToggleChange;
        component.showHelpButtonChange(event);
        expect(component.showHelp).toBe(true);

        component.showHelpButtonChange({
            checked: false,
        } as MatSlideToggleChange);
        expect(component.showHelp).toBe(false);
    });
});
