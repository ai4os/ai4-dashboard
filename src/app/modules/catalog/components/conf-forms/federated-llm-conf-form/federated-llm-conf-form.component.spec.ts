import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FederatedLlmConfFormComponent } from './federated-llm-conf-form.component';

describe('FederatedLlmConfFormComponent', () => {
    let component: FederatedLlmConfFormComponent;
    let fixture: ComponentFixture<FederatedLlmConfFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FederatedLlmConfFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FederatedLlmConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
