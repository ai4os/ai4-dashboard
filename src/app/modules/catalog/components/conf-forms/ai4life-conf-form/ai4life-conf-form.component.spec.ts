import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeConfFormComponent } from './ai4life-conf-form.component';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { AuthService } from '@app/core/services/auth/auth.service';
import { FormGroupDirective, FormBuilder } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { testProviders } from '@app/shared/testing/test-providers';

describe('Ai4lifeConfFormComponent', () => {
    let component: Ai4lifeConfFormComponent;
    let fixture: ComponentFixture<Ai4lifeConfFormComponent>;

    beforeEach(async () => {
        const fb = new FormBuilder();
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = fb.group({
            test: fb.control(null),
        });

        await TestBed.configureTestingModule({
            imports: [
                Ai4lifeConfFormComponent,
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [
                ...testProviders,
                FormGroupDirective,
                FormBuilder,
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4lifeConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
