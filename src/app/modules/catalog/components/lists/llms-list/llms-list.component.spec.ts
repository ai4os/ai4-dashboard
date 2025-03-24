import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmsListComponent } from './llms-list.component';

describe('LlmsListComponent', () => {
    let component: LlmsListComponent;
    let fixture: ComponentFixture<LlmsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LlmsListComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LlmsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
