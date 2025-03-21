import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmCardComponent } from './llm-card.component';

describe('LlmCardComponent', () => {
    let component: LlmCardComponent;
    let fixture: ComponentFixture<LlmCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LlmCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LlmCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
