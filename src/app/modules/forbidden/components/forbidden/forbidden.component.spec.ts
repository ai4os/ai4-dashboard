import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbiddenComponent } from './forbidden.component';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material.module';
import { RouterModule } from '@angular/router';

describe('ForbiddenComponent', () => {
    let component: ForbiddenComponent;
    let fixture: ComponentFixture<ForbiddenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), MaterialModule],
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
        const message = fixture.debugElement.query(By.css('h1')).nativeElement
            .textContent;
        expect(message).toEqual("You don't have the rights to do that!");
    });
});
