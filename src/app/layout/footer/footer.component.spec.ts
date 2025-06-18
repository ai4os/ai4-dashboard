import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [FooterComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize year correctly', () => {
        const currentYear = new Date().getFullYear();
        expect(component.year).toBe(currentYear);
    });

    it('should initialize footerLinks from AppConfigService', () => {
        expect(component.footerLinks).toEqual(mockedConfigService.footerLinks);
    });

    it('should initialize links from AppConfigService', () => {
        expect(component.links).toEqual(mockedConfigService.footerLinks);
    });
});
