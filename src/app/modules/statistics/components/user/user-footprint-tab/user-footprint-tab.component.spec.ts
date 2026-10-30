import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFootprintTabComponent } from './user-footprint-tab.component';

describe('UserFootprintTabComponent', () => {
    let component: UserFootprintTabComponent;
    let fixture: ComponentFixture<UserFootprintTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserFootprintTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UserFootprintTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
