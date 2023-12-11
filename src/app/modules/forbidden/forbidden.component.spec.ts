import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenComponent } from './forbidden.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForbiddenComponent', () => {
    let component: ForbiddenComponent;
    let fixture: ComponentFixture<ForbiddenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [ForbiddenComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ForbiddenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show message correctly', () => {
        const messageElement: HTMLElement = fixture.nativeElement;
        const message = messageElement.querySelector('h1')!;
        expect(message.textContent).toEqual(
            "You don't have the rights to do that!"
        );
    });
});
