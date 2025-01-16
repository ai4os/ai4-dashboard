import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ai4eoscListComponent } from './ai4eosc-list.component';

describe('AI4EOSCListComponent', () => {
    let component: Ai4eoscListComponent;
    let fixture: ComponentFixture<Ai4eoscListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Ai4eoscListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4eoscListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
