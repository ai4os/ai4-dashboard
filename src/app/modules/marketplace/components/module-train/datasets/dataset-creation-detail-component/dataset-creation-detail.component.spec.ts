import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetCreationDetailComponent } from './dataset-creation-detail.component';

describe('DatasetCreationDetailComponentComponent', () => {
    let component: DatasetCreationDetailComponent;
    let fixture: ComponentFixture<DatasetCreationDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetCreationDetailComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetCreationDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
