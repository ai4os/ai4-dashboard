import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NvflareConfFormComponent } from './nvflare-conf-form.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { of } from 'rxjs';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { testProviders } from '@testing/test-providers';

const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
    userProfileSubject: of({}),
};

const mockedMediaQueryList: MediaQueryList = {
    matches: true,
    media: 'test',
    onchange: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
};

const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

describe('NvflareConfFormComponent', () => {
    let component: NvflareConfFormComponent;
    let fixture: ComponentFixture<NvflareConfFormComponent>;
    const fb = new FormBuilder();
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
        test: fb.control(null),
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NvflareConfFormComponent,
                TranslatePipe,
                TranslateDirective,
            ],

            providers: [
                ...testProviders,
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NvflareConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
