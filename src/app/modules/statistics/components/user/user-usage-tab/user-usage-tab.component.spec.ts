import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { of } from 'rxjs';
import { ResourceSet } from '@app/shared/models/stats.view-models';
import { UserUsageTabComponent } from './user-usage-tab.component';
import { testProviders } from '@testing/test-providers';

const usage: ResourceSet = {
    cpu: { used: 2, total: 4 },
    memory: { used: 1024, total: 4096, unit: 'MiB' },
    disk: { used: 2048, total: 8192, unit: 'MiB' },
    gpu: { used: 0, total: 0 },
};

describe('UserUsageTabComponent', () => {
    let component: UserUsageTabComponent;
    let fixture: ComponentFixture<UserUsageTabComponent>;
    let deploymentsService: {
        getDeployments: jest.Mock;
        getTools: jest.Mock;
    };

    beforeEach(async () => {
        deploymentsService = {
            getDeployments: jest.fn().mockReturnValue(of([])),
            getTools: jest.fn().mockReturnValue(of([])),
        };
        await TestBed.configureTestingModule({
            imports: [UserUsageTabComponent],
            providers: [
                ...testProviders,
                { provide: DeploymentsService, useValue: deploymentsService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserUsageTabComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('usage', usage);
        fixture.detectChanges();
    });

    it('aggregates an empty deployment list and displays the input resource set', () => {
        expect(component.userItems).toHaveLength(7);
        expect(component.userItems[0].value).toBe(0);
        expect(deploymentsService.getDeployments).toHaveBeenCalledTimes(1);
        expect(deploymentsService.getTools).toHaveBeenCalledTimes(1);
        expect(fixture.nativeElement.textContent).toContain('2');
    });
});
