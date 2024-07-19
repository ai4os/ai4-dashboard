import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InferencesListComponent } from './inferences-list.component';

describe('ServicesListComponent', () => {
    let component: InferencesListComponent;
    let fixture: ComponentFixture<InferencesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InferencesListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(InferencesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
