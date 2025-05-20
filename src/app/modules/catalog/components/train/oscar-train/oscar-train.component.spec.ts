import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OscarTrainComponent } from './oscar-train.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import {
    mockAi4eoscModules,
    mockedModuleConfiguration,
    mockedModulesService,
} from '@app/modules/catalog/services/modules-service/modules-service.mock';
import { of } from 'rxjs';

const mockedConfigService: any = {};

describe('OscarTrainComponent', () => {
    let component: OscarTrainComponent;
    let fixture: ComponentFixture<OscarTrainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [OscarTrainComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
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

        fixture = TestBed.createComponent(OscarTrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set title and load configurations on init', () => {
        expect(mockedModulesService.getModule).toHaveBeenCalledWith('test');
        expect(
            mockedModulesService.getModuleOscarConfiguration
        ).toHaveBeenCalledWith('test');
        expect(component.title).toBe(mockAi4eoscModules[0].title);
        expect(component.generalConfDefaultValues).toEqual(
            mockedModuleConfiguration.general
        );
        expect(component.hardwareConfDefaultValues).toEqual(
            mockedModuleConfiguration.hardware
        );
    });

    it('should toggle showHelp when showHelpButtonChange is called', () => {
        component.showHelpButtonChange({ checked: true } as any);
        expect(component.showHelp).toBe(true);

        component.showHelpButtonChange({ checked: false } as any);
        expect(component.showHelp).toBe(false);
    });
});
