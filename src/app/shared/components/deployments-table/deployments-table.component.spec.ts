import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeploymentsTableComponent } from './deployments-table.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
import { DeploymentTableRow } from '@app/shared/interfaces/deployment.interface';
import { TranslateModule } from '@ngx-translate/core';
import { mockedMediaMatcher } from '@app/shared/mocks/media-matcher.mock';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { deploymentRow } from '@app/modules/deployments/services/deployments-service/deployments.service.mock';

describe('DeploymentsTableComponent', () => {
    let component: DeploymentsTableComponent;
    let fixture: ComponentFixture<DeploymentsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [DeploymentsTableComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeploymentsTableComponent);
        component = fixture.componentInstance;
        component.dataset = [];
        component.dataSource = new MatTableDataSource<DeploymentTableRow>(
            component.dataset
        );

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return correctly a deployments status of running', () => {
        // Check deployment runnning
        let deploymentStatus = component.isDeploymentRunning(deploymentRow);
        expect(deploymentStatus).toBe(true);
        // Check deployment status is empty
        deploymentRow.status = '';
        deploymentStatus = component.isDeploymentRunning(deploymentRow);
        expect(deploymentStatus).toBe(false);
        // Check deployment status is random string
        deploymentRow.status = 'dasdadasdnotrunning';
        deploymentStatus = component.isDeploymentRunning(deploymentRow);
        expect(deploymentStatus).toBe(false);
    });

    it('should return correctly a deployments endpoints', () => {
        //Endpoints undefined, should not crash
        component.getDeploymentEndpoints(deploymentRow);
        expect(component).toBeTruthy();
        //Endpoints are returned correctly
        const expectedEndpoints = {
            test: 'test',
        };
        deploymentRow.endpoints = expectedEndpoints;
        const endpoints = component.getDeploymentEndpoints(deploymentRow);
        expect(endpoints).toEqual(expectedEndpoints);
    });

    it('should return correctly a deployments error, if any', () => {
        //Error undefined, should not crash
        const nullData: unknown = undefined;
        deploymentRow.error_msg = nullData as string;
        component.hasDeploymentErrors(deploymentRow);
        expect(component).toBeTruthy();
        //Errors are returned correctly
        deploymentRow.error_msg = 'Something failed';
        const errorMsg = component.hasDeploymentErrors(deploymentRow);
        expect(errorMsg).toEqual('Something failed');
    });

    it('should return correctly a deployments badge correctly', () => {
        // Status undefined, should not crash
        const nullData: unknown = undefined;
        jest.spyOn(component, 'returnDeploymentBadge');
        component.returnDeploymentBadge(nullData as string);
        expect(component.returnDeploymentBadge).toHaveReturned();
        const badge = component.returnDeploymentBadge('running');
        expect(badge).toEqual('running-brightgreen');
    });
});
