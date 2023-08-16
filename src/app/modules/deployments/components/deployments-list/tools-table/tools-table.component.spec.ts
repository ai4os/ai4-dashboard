import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsTableComponent } from './tools-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedConfigService: any = {};

describe('ToolsTableComponent', () => {
    let component: ToolsTableComponent;
    let fixture: ComponentFixture<ToolsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ToolsTableComponent],
            imports: [
                SharedModule,
                RouterTestingModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ToolsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
