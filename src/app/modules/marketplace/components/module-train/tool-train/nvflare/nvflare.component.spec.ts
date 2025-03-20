import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NvflareComponent } from './nvflare.component';

describe('NvflareComponent', () => {
    let component: NvflareComponent;
    let fixture: ComponentFixture<NvflareComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NvflareComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NvflareComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
