import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleDetailComponent } from './module-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@app/shared/material.module';
import { TopNavbarComponent } from '@app/layout/top-navbar/top-navbar.component';

const mockedConfigService: any = {};
const mockedAuthService: any = {
    userProfileSubject: of({}),
};

describe('ModuleDetailComponent', () => {
    let component: ModuleDetailComponent;
    let fixture: ComponentFixture<ModuleDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModuleDetailComponent, TopNavbarComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                SharedModule,
                MaterialModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModuleDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
