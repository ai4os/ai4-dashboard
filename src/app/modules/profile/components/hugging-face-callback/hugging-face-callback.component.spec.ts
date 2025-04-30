import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuggingFaceCallbackComponent } from './hugging-face-callback.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HuggingFaceCallbackComponent', () => {
    let component: HuggingFaceCallbackComponent;
    let fixture: ComponentFixture<HuggingFaceCallbackComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HuggingFaceCallbackComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({
                            code: 'testCode',
                            state: 'testState',
                        }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HuggingFaceCallbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
