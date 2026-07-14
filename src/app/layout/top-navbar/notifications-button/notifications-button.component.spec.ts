import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NotificationsButtonComponent } from './notifications-button.component';
import { SharedModule } from '@app/shared/shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { mockedSnackbarService } from '@app/shared/services/snackbar/snackbar-service.mock';
import { of, throwError } from 'rxjs';
import { PlatformStatusService } from '@app/shared/services/platform-status/platform-status.service';
import { mockedPlatformStatusService } from '@app/shared/services/platform-status/platform-status.service.mock';
import { HtmlSanitizerService } from '@app/shared/services/html-sanitizer/html-sanitizer.service';
import { COMMON_TEST_PROVIDERS } from '@testing/test-providers';

const mockedHtmlSanitizerService: any = {
    getSanitizedText: jest.fn(),
};

describe('NotificationsButtonComponent', () => {
    let component: NotificationsButtonComponent;
    let fixture: ComponentFixture<NotificationsButtonComponent>;

    const mockedPlatformStatus = [
        { title: 'Test Notification 1', body: null },
        { title: 'Test Notification 2', body: null },
        { title: 'Test Notification 3', body: null },
    ];

    beforeEach(async () => {
        mockedPlatformStatusService.getPlatformNotifications.mockReturnValue(
            of(mockedPlatformStatus)
        );
        mockedPlatformStatusService.filterByDateAndVo.mockImplementation(
            (notifications: unknown[]) => notifications
        );

        await TestBed.configureTestingModule({
            declarations: [NotificationsButtonComponent],
            imports: [SharedModule, TranslatePipe, TranslateDirective],
            providers: [
                ...COMMON_TEST_PROVIDERS,

                { provide: SnackbarService, useValue: mockedSnackbarService },
                {
                    provide: PlatformStatusService,
                    useValue: mockedPlatformStatusService,
                },
                {
                    provide: HtmlSanitizerService,
                    useValue: mockedHtmlSanitizerService,
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationsButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch notifications on init and filter them by date/vo', () => {
        expect(
            mockedPlatformStatusService.getPlatformNotifications
        ).toHaveBeenCalled();
        expect(
            mockedPlatformStatusService.filterByDateAndVo
        ).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ title: 'Test Notification 1' }),
            ])
        );
    });

    it('should show the badge when there are notifications', () => {
        const badge = fixture.debugElement.query(
            By.css('.notifications-button__badge')
        );
        expect(badge).toBeTruthy();
    });

    it('should not show the badge when there are no notifications', () => {
        mockedPlatformStatusService.getPlatformNotifications.mockReturnValue(
            of([])
        );

        fixture = TestBed.createComponent(NotificationsButtonComponent);
        fixture.detectChanges();

        const badge = fixture.debugElement.query(
            By.css('.notifications-button__badge')
        );
        expect(badge).toBeNull();
    });

    it('should open the panel and list all notifications when the trigger is clicked', () => {
        const trigger = fixture.debugElement.query(
            By.css('.notifications-button__trigger')
        );
        trigger.nativeElement.click();
        fixture.detectChanges();

        const items = fixture.debugElement.queryAll(
            By.css('.notifications-button__item')
        );
        expect(items.length).toBe(3);
    });

    it('should show the empty message when the panel is opened with no notifications', () => {
        mockedPlatformStatusService.getPlatformNotifications.mockReturnValue(
            of([])
        );

        fixture = TestBed.createComponent(NotificationsButtonComponent);
        fixture.detectChanges();

        const trigger = fixture.debugElement.query(
            By.css('.notifications-button__trigger')
        );
        trigger.nativeElement.click();
        fixture.detectChanges();

        const empty = fixture.debugElement.query(
            By.css('.notifications-button__empty')
        );
        expect(empty).toBeTruthy();
    });

    it('should close the panel when clicking outside the component', () => {
        const trigger = fixture.debugElement.query(
            By.css('.notifications-button__trigger')
        );
        trigger.nativeElement.click();
        fixture.detectChanges();

        expect(
            fixture.debugElement.query(By.css('.notifications-button__panel'))
        ).toBeTruthy();

        document.dispatchEvent(new MouseEvent('click'));
        fixture.detectChanges();

        expect(
            fixture.debugElement.query(By.css('.notifications-button__panel'))
        ).toBeNull();
    });

    it('should close the panel on Escape key', () => {
        const trigger = fixture.debugElement.query(
            By.css('.notifications-button__trigger')
        );
        trigger.nativeElement.click();
        fixture.detectChanges();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();

        expect(
            fixture.debugElement.query(By.css('.notifications-button__panel'))
        ).toBeNull();
    });

    it('should handle error when getPlatformNotifications fails', () => {
        mockedPlatformStatusService.getPlatformNotifications.mockReturnValue(
            throwError(() => new Error('Error fetching notifications'))
        );

        fixture = TestBed.createComponent(NotificationsButtonComponent);
        fixture.detectChanges();

        expect(mockedSnackbarService.openError).toHaveBeenCalledWith(
            'Error retrieving the platform notifications'
        );

        const badge = fixture.debugElement.query(
            By.css('.notifications-button__badge')
        );
        expect(badge).toBeNull();
    });
});
