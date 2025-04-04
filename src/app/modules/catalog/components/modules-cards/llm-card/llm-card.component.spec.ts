import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmCardComponent } from './llm-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';
import { AuthService } from '@app/core/services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';

const mockedUserProfile = new BehaviorSubject({});

const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
    userProfileSubject: mockedUserProfile,
    getValue: jest.fn(() => mockedUserProfile.getValue()),
};

const mockedLlm: VllmModelConfig = {
    name: '',
    description: '',
    family: '',
    license: '',
    context: '',
    needs_HF_token: false,
    args: [],
};

describe('LlmCardComponent', () => {
    let component: LlmCardComponent;
    let fixture: ComponentFixture<LlmCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LlmCardComponent],
            imports: [TranslateModule.forRoot()],
            providers: [{ provide: AuthService, useValue: mockedAuthService }],
        }).compileComponents();

        fixture = TestBed.createComponent(LlmCardComponent);
        component = fixture.componentInstance;
        component.llm = mockedLlm;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
