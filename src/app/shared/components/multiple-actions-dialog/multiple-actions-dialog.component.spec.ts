import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleActionsDialogComponent } from './multiple-actions-dialog.component';

describe('MultipleActionsDialogComponent', () => {
    let component: MultipleActionsDialogComponent;
    let fixture: ComponentFixture<MultipleActionsDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MultipleActionsDialogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MultipleActionsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
