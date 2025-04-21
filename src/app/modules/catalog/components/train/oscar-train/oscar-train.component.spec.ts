import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OscarTrainComponent } from './oscar-train.component';

describe('OscarTrainComponent', () => {
    let component: OscarTrainComponent;
    let fixture: ComponentFixture<OscarTrainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OscarTrainComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OscarTrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
