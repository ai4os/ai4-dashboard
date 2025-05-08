import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { expect } from '@jest/globals';
import { TranslateModule } from '@ngx-translate/core';
import { OverviewTabComponent } from './overview-tab.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockedConfigService } from '@app/shared/mocks/app-config.mock';
import { mockedDeploymentService } from '@app/shared/mocks/deployments.service.mock';
import { mockedGlobalStats } from '@app/shared/mocks/stats.service.mock';

describe('OverviewTabComponent', () => {
    let component: OverviewTabComponent;
    let fixture: ComponentFixture<OverviewTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OverviewTabComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                {
                    provide: DeploymentsService,
                    useValue: mockedDeploymentService,
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(OverviewTabComponent);
        component = fixture.componentInstance;
        component.clusterGlobalStats = mockedGlobalStats;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('shows cluster usage overview', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const title = compiled.querySelector('#title-cluster')?.textContent;
        expect(title).toContain('CLUSTER');
        const { debugElement } = fixture;
        const container = debugElement.query(By.css('app-stats-container'));
        expect(container).toBeTruthy();
    });

    it('shows your usage', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const title = compiled.querySelector('#title-user')?.textContent;
        expect(title).toContain('USERS');
        const cards = fixture.debugElement.queryAll(By.css('mat-card'));
        expect(cards.length).toBe(6);
    });
});
