import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatacentersTabComponent } from './datacenters-tab.component';

describe('DatacentersTabComponent', () => {
    let component: DatacentersTabComponent;
    let fixture: ComponentFixture<DatacentersTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ DatacentersTabComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DatacentersTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
