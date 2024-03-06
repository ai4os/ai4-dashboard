import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaServerComponent } from './kafka-server.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SharedModule } from '@app/shared/shared.module';

const mockedConfigService: any = {};

describe('KafkaServerComponent', () => {
    let component: KafkaServerComponent;
    let fixture: ComponentFixture<KafkaServerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KafkaServerComponent],
            imports: [HttpClientTestingModule, SharedModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },

                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({
                            id: 'test',
                        }),
                        snapshot: {
                            paramMap: {
                                get: () => 'test', // represents the id
                            },
                        },
                        routeConfig: { path: 'test' },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(KafkaServerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
