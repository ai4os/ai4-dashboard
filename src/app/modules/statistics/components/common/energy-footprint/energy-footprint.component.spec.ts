import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyFootprintComponent } from './energy-footprint.component';

describe('EnergyFootprintComponent', () => {
    let component: EnergyFootprintComponent;
    let fixture: ComponentFixture<EnergyFootprintComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EnergyFootprintComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EnergyFootprintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
