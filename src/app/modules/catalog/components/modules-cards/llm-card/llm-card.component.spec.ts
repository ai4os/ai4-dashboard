import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmCardComponent } from './llm-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';

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
            imports: [TranslateModule.forRoot()],
            declarations: [LlmCardComponent],
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
