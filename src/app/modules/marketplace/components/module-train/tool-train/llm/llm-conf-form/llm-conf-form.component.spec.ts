import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmConfFormComponent } from './llm-conf-form.component';

describe('LlmConfFormComponent', () => {
    let component: LlmConfFormComponent;
    let fixture: ComponentFixture<LlmConfFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LlmConfFormComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LlmConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
