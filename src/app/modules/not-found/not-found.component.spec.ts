import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@app/shared/material.module';

describe('NotFoundComponent', () => {
    let component: NotFoundComponent;
    let fixture: ComponentFixture<NotFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), MaterialModule],
            declarations: [NotFoundComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show message correctly', () => {
        const message = fixture.debugElement.query(By.css('h1')).nativeElement
            .textContent;
        expect(message).toEqual('ERRORS.NOT-FOUND');
    });
});
