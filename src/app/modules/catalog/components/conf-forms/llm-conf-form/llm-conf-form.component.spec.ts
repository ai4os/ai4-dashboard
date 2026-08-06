import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmConfFormComponent } from './llm-conf-form.component';
import { testProviders } from '@app/shared/testing/test-providers';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { AuthService } from '@app/core/services/auth/auth.service';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { FormBuilder, FormGroupDirective } from '@angular/forms';

describe('LlmConfFormComponent', () => {
    let component: LlmConfFormComponent;
    let fixture: ComponentFixture<LlmConfFormComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            imports: [LlmConfFormComponent],
            providers: [
                ...testProviders,

                { provide: AuthService, useValue: mockedAuthService },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LlmConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
