import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnergyFootprintComponent } from './energy-footprint.component';
import { testProviders } from '@testing/test-providers';

describe('EnergyFootprintComponent', () => {
    let component: EnergyFootprintComponent;
    let fixture: ComponentFixture<EnergyFootprintComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EnergyFootprintComponent],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(EnergyFootprintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
