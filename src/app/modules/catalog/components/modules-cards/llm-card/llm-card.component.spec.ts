import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmCardComponent } from './llm-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { mockedAuthService } from '@app/shared/mocks/auth-service.mock';
import { mockedVllmsConfig } from '@app/shared/mocks/tools-service.mock';
import { Router } from '@angular/router';
import { mockRouter } from '@app/shared/mocks/router.mock';

describe('LlmCardComponent', () => {
    let component: LlmCardComponent;
    let fixture: ComponentFixture<LlmCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LlmCardComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: AuthService, useValue: mockedAuthService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LlmCardComponent);
        component = fixture.componentInstance;
        component.llm = mockedVllmsConfig[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize image with llm.family', () => {
        expect(component.image).toBe(component.llm.family);
    });

    it('should call router.navigate with correct arguments on loadLLM()', () => {
        component.loadLLM();
        expect(mockRouter.navigate).toHaveBeenCalledWith(
            ['catalog/llms/ai4os-llm/deploy'],
            {
                state: {
                    llmId: `${component.llm.family}/${component.llm.name}`,
                },
            }
        );
    });

    it('should open Hugging Face link on openLink()', () => {
        const openSpy = jest
            .spyOn(window, 'open')
            .mockImplementation(() => null);
        const event = new MouseEvent('click');
        component.openLink(event);
        expect(openSpy).toHaveBeenCalledWith(
            `https://huggingface.co/${component.llm.family}/${component.llm.name}`
        );
        openSpy.mockRestore();
    });
});
