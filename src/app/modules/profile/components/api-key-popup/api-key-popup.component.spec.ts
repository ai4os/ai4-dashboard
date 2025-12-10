import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyPopupComponent } from './api-key-popup.component';

describe('ApiKeyPopupComponent', () => {
    let component: ApiKeyPopupComponent;
    let fixture: ComponentFixture<ApiKeyPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApiKeyPopupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ApiKeyPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
