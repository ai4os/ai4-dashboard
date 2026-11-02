import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FederatedLlmConfFormComponent } from './federated-llm-conf-form.component';
import { testProviders } from '@testing/test-providers';

describe('FederatedLlmConfFormComponent', () => {
    let component: FederatedLlmConfFormComponent;
    let fixture: ComponentFixture<FederatedLlmConfFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FederatedLlmConfFormComponent],
            providers: [
                ...testProviders,
                {
                    provide: FormGroupDirective,
                    useValue: { form: new FormGroup({}) },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FederatedLlmConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
