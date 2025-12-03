import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4eoscServicesComponent } from './ai4eosc-services.component';

describe('Ai4eoscServicesComponent', () => {
    let component: Ai4eoscServicesComponent;
    let fixture: ComponentFixture<Ai4eoscServicesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4eoscServicesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4eoscServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
