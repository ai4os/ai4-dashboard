import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FederatedSimulationConfFormComponent } from './federated-simulation-conf-form.component';

describe('FederatedSimulationConfFormComponent', () => {
    let component: FederatedSimulationConfFormComponent;
    let fixture: ComponentFixture<FederatedSimulationConfFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FederatedSimulationConfFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FederatedSimulationConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
