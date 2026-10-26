import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentSecretsComponent } from './deployment-secrets.component';

describe('DeploymentSecretsComponent', () => {
    let component: DeploymentSecretsComponent;
    let fixture: ComponentFixture<DeploymentSecretsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DeploymentSecretsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DeploymentSecretsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
