import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsButtonComponent } from './notifications-button.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NotificationsButtonComponent', () => {
    let component: NotificationsButtonComponent;
    let fixture: ComponentFixture<NotificationsButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NotificationsButtonComponent],
            imports: [SharedModule, TranslateModule.forRoot()],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationsButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
