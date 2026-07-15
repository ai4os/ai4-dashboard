import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { TryMeService } from '../../services/try-me.service';
import { GradioDeployment } from '@app/shared/interfaces/module.interface';
import { MediaMatcher } from '@angular/cdk/layout';
import { KeyValue } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getDeploymentBadge } from '@app/modules/deployments/utils/deployment-badge';

@Component({
    selector: 'app-try-me-detail',
    templateUrl: './try-me-detail.component.html',
    styleUrls: ['./try-me-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class TryMeDetailComponent implements OnInit {
    private tryMeService = inject(TryMeService);
    confirmationDialog = inject(MatDialog);
    data = inject<{
        uuid: string;
    }>(MAT_DIALOG_DATA);
    private changeDetectorRef = inject(ChangeDetectorRef);
    private media = inject(MediaMatcher);

    constructor() {
        const changeDetectorRef = this.changeDetectorRef;

        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    deployment: GradioDeployment | undefined;
    statusBadge = '';
    isLoading = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    ngOnInit(): void {
        if (this.data.uuid) {
            this.isLoading = true;
            this.tryMeService
                .getDeploymentGradioByUUID(this.data.uuid)
                .subscribe((deployment: GradioDeployment) => {
                    this.isLoading = false;
                    if (deployment.description == '') {
                        deployment.description = '-';
                    }
                    if (deployment.datacenter == null) {
                        deployment.datacenter = '-';
                    }
                    this.statusBadge = getDeploymentBadge(deployment.status);
                    this.deployment = deployment;
                });
        }
    }

    getResourceValue(resource: KeyValue<string, number>): string {
        let resourceValue = resource.value.toString();
        if (resource.key.includes('MB')) {
            resourceValue = resourceValue.concat(' MB');
        } else if (resource.key.includes('MHz')) {
            resourceValue = resourceValue.concat(' MHz');
        }
        return resourceValue;
    }

    isActiveEndPoint(endpoint: string) {
        return (
            this.deployment?.active_endpoints &&
            this.deployment.active_endpoints.indexOf(endpoint) > -1
        );
    }
}
