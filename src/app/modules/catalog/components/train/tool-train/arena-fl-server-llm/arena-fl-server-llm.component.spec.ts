import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@app/core/services/auth/auth.service';
import { mockedAuthService } from '@app/core/services/auth/auth-service.mock';
import { ArenaFlServerLlmComponent } from './arena-fl-server-llm.component';
import { testProviders } from '@testing/test-providers';

describe('ArenaFlServerLlmComponent', () => {
    let component: ArenaFlServerLlmComponent;
    let fixture: ComponentFixture<ArenaFlServerLlmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArenaFlServerLlmComponent],
            providers: [
                ...testProviders,
                { provide: AuthService, useValue: mockedAuthService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ArenaFlServerLlmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
