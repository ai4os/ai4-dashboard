import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OscarTrainComponent } from './oscar-train.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

const mockedConfigService: any = {};

describe('OscarTrainComponent', () => {
    let component: OscarTrainComponent;
    let fixture: ComponentFixture<OscarTrainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [OscarTrainComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        state: {
                            service: 'test',
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OscarTrainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
