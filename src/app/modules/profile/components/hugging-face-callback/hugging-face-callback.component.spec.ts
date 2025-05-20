import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuggingFaceCallbackComponent } from './hugging-face-callback.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProfileService } from '../../services/profile.service';
import { mockedProfileService } from '@app/modules/profile/services/profile.service.mock';
import { mockRouter } from '@app/shared/mocks/router.mock';

describe('HuggingFaceCallbackComponent', () => {
    let component: HuggingFaceCallbackComponent;
    let fixture: ComponentFixture<HuggingFaceCallbackComponent>;
    let queryParamsSubject: Subject<any>;

    beforeEach(async () => {
        queryParamsSubject = new Subject();

        await TestBed.configureTestingModule({
            declarations: [HuggingFaceCallbackComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: ProfileService, useValue: mockedProfileService },
                { provide: Router, useValue: mockRouter },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: queryParamsSubject.asObservable(),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HuggingFaceCallbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call validateOAuthRedirect and navigate on success', () => {
        queryParamsSubject.next({ code: 'testCode', state: 'testState' });

        expect(mockedProfileService.validateOAuthRedirect).toHaveBeenCalledWith(
            'testCode',
            'testState'
        );
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should navigate on validateOAuthRedirect error', () => {
        queryParamsSubject.next({ code: 'testCode', state: 'testState' });

        mockedProfileService.validateOAuthRedirect.mockReturnValue(
            throwError(() => new Error('Error'))
        );

        expect(mockedProfileService.validateOAuthRedirect).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should navigate when code or state is missing', async () => {
        queryParamsSubject.next({});

        expect(
            mockedProfileService.validateOAuthRedirect
        ).not.toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });
});
