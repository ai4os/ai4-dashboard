import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTrainComponent } from './batch-train.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import {
    mockedModuleConfiguration,
    mockedModulesService,
} from '@app/modules/catalog/services/modules-service/modules-service.mock';
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('BatchTrainComponent', () => {
    let component: BatchTrainComponent;
    let fixture: ComponentFixture<BatchTrainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BatchTrainComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: ModulesService, useValue: mockedModulesService },
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
