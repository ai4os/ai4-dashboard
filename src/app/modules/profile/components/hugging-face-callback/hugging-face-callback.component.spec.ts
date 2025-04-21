import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuggingFaceCallbackComponent } from './hugging-face-callback.component';

describe('HuggingFaceCallbackComponent', () => {
    let component: HuggingFaceCallbackComponent;
    let fixture: ComponentFixture<HuggingFaceCallbackComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HuggingFaceCallbackComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HuggingFaceCallbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
