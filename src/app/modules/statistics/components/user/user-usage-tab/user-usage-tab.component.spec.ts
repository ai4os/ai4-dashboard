import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUsageTabComponent } from './user-usage-tab.component';

describe('UserUsageTabComponent', () => {
    let component: UserUsageTabComponent;
    let fixture: ComponentFixture<UserUsageTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserUsageTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UserUsageTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
