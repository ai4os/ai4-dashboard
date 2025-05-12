import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFileUploadComponent } from './single-file-upload.component';

describe('SingleFileUploadComponent', () => {
    let component: SingleFileUploadComponent;
    let fixture: ComponentFixture<SingleFileUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SingleFileUploadComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SingleFileUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
