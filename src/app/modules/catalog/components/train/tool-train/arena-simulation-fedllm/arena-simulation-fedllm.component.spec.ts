import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaSimulationFedllmComponent } from './arena-simulation-fedllm.component';

describe('ArenaSimulationFedllmComponent', () => {
    let component: ArenaSimulationFedllmComponent;
    let fixture: ComponentFixture<ArenaSimulationFedllmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArenaSimulationFedllmComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArenaSimulationFedllmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
