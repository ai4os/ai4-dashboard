import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { FederatedSimulationConfFormComponent } from './federated-simulation-conf-form.component';
import { ServicesCredentialsStore } from '@app/modules/profile/store/services-credentials.store';
import { testProviders } from '@testing/test-providers';

describe('FederatedSimulationConfFormComponent', () => {
    let component: FederatedSimulationConfFormComponent;
    let fixture: ComponentFixture<FederatedSimulationConfFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FederatedSimulationConfFormComponent],
            providers: [
                ...testProviders,
                {
                    provide: FormGroupDirective,
                    useValue: { form: new FormGroup({}) },
                },
                {
                    provide: ServicesCredentialsStore,
                    useValue: {
                        hfToken: () => '',
                        ensureLoaded: jest.fn(),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FederatedSimulationConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
