import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NvflareConfFormComponent } from './nvflare-conf-form.component';

describe('NvflareConfFormComponent', () => {
    let component: NvflareConfFormComponent;
    let fixture: ComponentFixture<NvflareConfFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NvflareConfFormComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NvflareConfFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
