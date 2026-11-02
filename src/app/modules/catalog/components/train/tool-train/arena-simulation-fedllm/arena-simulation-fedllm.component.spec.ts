import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@app/core/services/auth/auth.service';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { ArenaSimulationFedllmComponent } from './arena-simulation-fedllm.component';
import { testProviders } from '@testing/test-providers';

describe('ArenaSimulationFedllmComponent', () => {
    let component: ArenaSimulationFedllmComponent;
    let fixture: ComponentFixture<ArenaSimulationFedllmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArenaSimulationFedllmComponent],
            providers: [
                ...testProviders,
                { provide: AuthService, useValue: mockedAuthService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ArenaSimulationFedllmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
