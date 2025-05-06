import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NvflareComponent } from './nvflare.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import {
    mockedToolsService,
    mockNvflareTool,
    mockNvflareToolConfiguration,
} from '@app/shared/mocks/tools-service.mock';
import { of } from 'rxjs';

describe('NvflareComponent', () => {
    let component: NvflareComponent;
    let fixture: ComponentFixture<NvflareComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([])],
            declarations: [NvflareComponent],
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
                                id: 'ai4os-nvflare',
                            }),
                        },
                    },
                },
            ],
        }).compileComponents();

        mockedToolsService.getTool.mockReturnValue(of(mockNvflareTool));

        fixture = TestBed.createComponent(NvflareComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load module and set data', () => {
        component.ngOnInit();

        expect(mockedToolsService.getTool).toHaveBeenCalledWith(
            'ai4os-nvflare'
        );
        expect(mockedToolsService.getNvflareConfiguration).toHaveBeenCalledWith(
            'ai4os-nvflare'
        );

        expect(component.title).toBe('Federated learning with NVFlare');
        expect(component.generalConfDefaultValues).toEqual(
            mockNvflareToolConfiguration.general
        );
        expect(component.hardwareConfDefaultValues).toEqual(
            mockNvflareToolConfiguration.hardware
        );
        expect(component.nvflareConfDefaultValues).toEqual(
            mockNvflareToolConfiguration.nvflare
        );
    });

    it('should update showHelp on slide toggle change', () => {
        const event = { checked: true } as MatSlideToggleChange;
        component.showHelpButtonChange(event);
        expect(component.showHelp).toBe(true);
    });
});
