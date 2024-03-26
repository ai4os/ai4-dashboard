import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleOscarDeployComponent } from './module-oscar-deploy.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModulesService } from '@modules/marketplace/services/modules-service/modules.service';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '@app/shared/shared.module';
import { MarketplaceModule } from '@modules/marketplace/marketplace.module';
import { MaterialModule } from '@app/shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const mockedConfigService: any = {};
const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
};
const mockedModuleService: any = {
    getModuleConfiguration: jest.fn().mockReturnValue({}),
    getAccessToken: jest.fn().mockReturnValue('token'),
};

describe('ModuleOscarDeployComponent', () => {
    let component: ModuleOscarDeployComponent;
    let fixture: ComponentFixture<ModuleOscarDeployComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModuleOscarDeployComponent],
            imports: [
                BrowserAnimationsModule,
                MarketplaceModule,
                SharedModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: OAuthStorage, useValue: {} },
                { provide: ModulesService, useValue: mockedModuleService },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModuleOscarDeployComponent);
        component = fixture.componentInstance;
        component.dockerImageName = 'test';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
