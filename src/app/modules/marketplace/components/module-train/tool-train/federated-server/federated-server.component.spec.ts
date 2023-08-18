import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FederatedServerComponent } from './federated-server.component';

describe('FederatedServerComponent', () => {
    let component: FederatedServerComponent;
    let fixture: ComponentFixture<FederatedServerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FederatedServerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FederatedServerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
