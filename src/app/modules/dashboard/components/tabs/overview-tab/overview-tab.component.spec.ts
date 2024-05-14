import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { GlobalStats } from '@app/shared/interfaces/stats.interface';
import { expect } from '@jest/globals';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { OverviewTabComponent } from './overview-tab.component';

const mockedDeployment: Deployment = {
    job_ID: 'deployment-test',
    status: '',
    owner: '',
    title: '',
    docker_image: '',
    submit_time: '',
    main_endpoint: '',
    description: '',
    error_msg: 'Test error',
    resources: {
        cpu_MHz: 0,
        cpu_num: 0,
        gpu_num: 1,
        memory_MB: 10,
        disk_MB: 20,
    },
};

const mockedTool: Deployment = {
    job_ID: 'tool-test',
    status: '',
    owner: '',
    title: '',
    docker_image: '',
    submit_time: '',
    main_endpoint: '',
    description: '',
    error_msg: 'Test error',
    resources: {
        cpu_MHz: 0,
        cpu_num: 0,
        gpu_num: 1,
        memory_MB: 10,
        disk_MB: 20,
    },
};

const mockedConfigService: any = {};

const mockedClusterStats: GlobalStats = {
    cpuNumAgg: 14,
    cpuNumTotal: 345,
    memoryMBAgg: 234,
    memoryMBTotal: 234234,
    diskMBAgg: 234,
    diskMBTotal: 2346,
    gpuNumAgg: 12,
    gpuNumTotal: 545,
};

const mockedDeploymentService: any = {
    getDeployments: jest.fn().mockReturnValue(of([mockedDeployment])),
    getTools: jest.fn().mockReturnValue(of([mockedTool])),
};

describe('OverviewTabComponent', () => {
    let component: OverviewTabComponent;
    let fixture: ComponentFixture<OverviewTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OverviewTabComponent],
            imports: [TranslateModule.forRoot(), HttpClientTestingModule],
            providers: [
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
        component.clusterGlobalStats = mockedClusterStats;
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
