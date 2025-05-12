import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTrainComponent } from './batch-train.component';

describe('BatchTrainComponent', () => {
    let component: BatchTrainComponent;
    let fixture: ComponentFixture<BatchTrainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BatchTrainComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BatchTrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
