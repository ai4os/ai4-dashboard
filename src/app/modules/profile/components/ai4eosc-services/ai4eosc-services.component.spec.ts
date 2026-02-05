import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4eoscServicesComponent } from './ai4eosc-services.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { MediaMatcher } from '@angular/cdk/layout';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';

describe('Ai4eoscServicesComponent', () => {
    let component: Ai4eoscServicesComponent;
    let fixture: ComponentFixture<Ai4eoscServicesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4eoscServicesComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4eoscServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
