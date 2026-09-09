import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvatConfFormComponent } from './cvat-conf-form.component';
import { testProviders } from '@app/shared/testing/test-providers';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { AuthService } from '@app/core/services/auth/auth.service';
import { FormBuilder, FormGroupDirective } from '@angular/forms';

describe('CvatConfFormComponent', () => {
    let component: CvatConfFormComponent;
    let fixture: ComponentFixture<CvatConfFormComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            imports: [CvatConfFormComponent],
            providers: [
                ...testProviders,
                { provide: AuthService, useValue: mockedAuthService },
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CvatConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set email based on profile for cvat', () => {
        (mockedAuthService.userProfileSubject as any).next({
            email: 'cvat@example.com',
        });

        fixture.detectChanges();
        const cvatUsername = component.cvatConfFormGroup.get('usernameInput');
        expect(cvatUsername?.value).toBe('cvat@example.com');
    });
});
