import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaFlServerLlmComponent } from './arena-fl-server-llm.component';

describe('ArenaFlServerLlmComponent', () => {
    let component: ArenaFlServerLlmComponent;
    let fixture: ComponentFixture<ArenaFlServerLlmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ArenaFlServerLlmComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArenaFlServerLlmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
