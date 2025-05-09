import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';

import { NotificationsButtonComponent } from './notifications-button.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedSnackbarService } from '@app/shared/mocks/snackbar-service.mock';
import { throwError } from 'rxjs';
import { PlatformStatusService } from '@app/shared/services/platform-status/platform-status.service';
import { mockedPlatformStatusService } from '@app/shared/mocks/platform-status.service.mock';

describe('NotificationsButtonComponent', () => {
    let component: NotificationsButtonComponent;
    let fixture: ComponentFixture<NotificationsButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NotificationsButtonComponent],
            imports: [SharedModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: SnackbarService, useValue: mockedSnackbarService },
                {
                    provide: PlatformStatusService,
                    useValue: mockedPlatformStatusService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationsButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call getPlatformNotifications and add notifications to the list', () => {
        expect(component.notifications.length).toBe(1);
        expect(component.notifications[0].title).toBe('Test Notification');
    });

    it('should handle error when getPlatformNotifications fails', fakeAsync(() => {
        mockedPlatformStatusService.getPlatformNotifications.mockReturnValue(
            throwError(() => new Error('Error fetching notifications'))
        );

        component.getNotifications();

        tick(100);
        fixture.detectChanges();

        expect(component.notifications.length).toBe(0);
        expect(mockedSnackbarService.openError).toHaveBeenCalledWith(
            'Error retrieving the platform notifications'
        );
    }));
});
