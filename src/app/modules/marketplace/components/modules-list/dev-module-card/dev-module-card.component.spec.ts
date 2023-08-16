import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevModuleCardComponent } from './dev-module-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TranslateModule } from '@ngx-translate/core';

const mockedConfigService: any = {};

describe('DevModuleCardComponent', () => {
    let component: DevModuleCardComponent;
    let fixture: ComponentFixture<DevModuleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DevModuleCardComponent],
            imports: [
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DevModuleCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
