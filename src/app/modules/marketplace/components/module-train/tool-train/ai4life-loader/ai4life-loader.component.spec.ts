import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeLoaderComponent } from './ai4life-loader.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterModule } from '@angular/router';

const mockedConfigService: any = {};

describe('Ai4lifeLoaderComponent', () => {
    let component: Ai4lifeLoaderComponent;
    let fixture: ComponentFixture<Ai4lifeLoaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4lifeLoaderComponent],
            imports: [RouterModule.forRoot([])],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4lifeLoaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
