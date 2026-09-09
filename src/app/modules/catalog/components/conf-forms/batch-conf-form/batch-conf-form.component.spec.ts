import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchConfFormComponent } from './batch-conf-form.component';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { AuthService } from '@app/core/services/auth/auth.service';
import { testProviders } from '@app/shared/testing/test-providers';

describe('BatchConfFormComponent', () => {
    let component: BatchConfFormComponent;
    let fixture: ComponentFixture<BatchConfFormComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            imports: [BatchConfFormComponent],
            providers: [
                ...testProviders,

                { provide: AuthService, useValue: mockedAuthService },
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BatchConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
