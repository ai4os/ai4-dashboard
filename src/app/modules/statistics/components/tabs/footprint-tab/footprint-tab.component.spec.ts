import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintTabComponent } from './footprint-tab.component';
import { TranslateModule } from '@ngx-translate/core';

describe('FootprintTabComponent', () => {
    let component: FootprintTabComponent;
    let fixture: ComponentFixture<FootprintTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FootprintTabComponent],
            imports: [TranslateModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FootprintTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
