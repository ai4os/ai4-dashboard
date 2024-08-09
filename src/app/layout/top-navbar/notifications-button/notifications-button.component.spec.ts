import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsButtonComponent } from './notifications-button.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

describe('NotificationsButtonComponent', () => {
    let component: NotificationsButtonComponent;
    let fixture: ComponentFixture<NotificationsButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NotificationsButtonComponent],
            imports: [
                SharedModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationsButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
