import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingScreenComponent } from './loading-screen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModulesService } from '../../services/modules-service/modules.service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockedModuleService: any = {
    createDeploymentGradio: jest.fn(),
    getDeploymentGradio: jest.fn(),
};

describe('LoadingScreenComponent', () => {
    let component: LoadingScreenComponent;
    let fixture: ComponentFixture<LoadingScreenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadingScreenComponent],
            imports: [
                HttpClientTestingModule,
                NoopAnimationsModule,
                SharedModule,
                TranslateModule.forRoot(),
            ],

            providers: [
                { provide: ModulesService, useValue: mockedModuleService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
