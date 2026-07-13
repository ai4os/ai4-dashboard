import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuggingFaceCallbackComponent } from './hugging-face-callback.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { HuggingFaceService } from '../../services/hugging-face-service/hugging-face.service';
import { mockRouter } from '@app/shared/mocks/router.mock';
import { COMMON_TEST_PROVIDERS } from '@testing/test-providers';
import { mockedHuggingFaceService } from '../../services/hugging-face-service/hugging-face.service.mock';

describe('HuggingFaceCallbackComponent', () => {
    let component: HuggingFaceCallbackComponent;
    let fixture: ComponentFixture<HuggingFaceCallbackComponent>;
    let queryParamsSubject: Subject<any>;

    beforeEach(async () => {
        queryParamsSubject = new Subject();

        mockedHuggingFaceService.validateOAuthRedirect.mockReturnValue(
            of(undefined)
        );

        await TestBed.configureTestingModule({
            declarations: [HuggingFaceCallbackComponent],
            providers: [
                ...COMMON_TEST_PROVIDERS,
                {
                    provide: HuggingFaceService,
                    useValue: mockedHuggingFaceService,
                },
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

        expect(
            mockedHuggingFaceService.validateOAuthRedirect
        ).toHaveBeenCalledWith('testCode', 'testState');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should navigate on validateOAuthRedirect error', () => {
        mockedHuggingFaceService.validateOAuthRedirect.mockReturnValue(
            throwError(() => new Error('Error'))
        );

        queryParamsSubject.next({ code: 'testCode', state: 'testState' });

        expect(
            mockedHuggingFaceService.validateOAuthRedirect
        ).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should navigate when code or state is missing', () => {
        queryParamsSubject.next({});

        expect(
            mockedHuggingFaceService.validateOAuthRedirect
        ).not.toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
    });
});
