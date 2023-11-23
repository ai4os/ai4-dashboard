import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { DeploymentsService } from '../../services/deployments.service';
import { getDeploymentBadge } from '../../utils/deployment-badge';
import { KeyValue } from '@angular/common';

@Component({
    selector: 'app-deployment-detail',
    templateUrl: './deployment-detail.component.html',
    styleUrls: ['./deployment-detail.component.scss'],
})
export class DeploymentDetailComponent implements OnInit {
    constructor(
        private deploymentsService: DeploymentsService,
        public confirmationDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: { uuid: 'string'; isTool: boolean }
    ) {}

    deployment: Deployment | undefined;
    statusBadge = '';
    isLoading = false;
    protected deploymentHasError = false;

    isActiveEndPoint(endpoint: string) {
        return (
            this.deployment?.active_endpoints &&
            this.deployment.active_endpoints.indexOf(endpoint) > -1
        );
    }

    ngOnInit(): void {
        if (this.data.uuid) {
            this.isLoading = true;
            if (this.data.isTool) {
                this.deploymentsService
                    .getToolByUUID(this.data.uuid)
                    .subscribe((deployment: Deployment) => {
                        this.isLoading = false;
                        if (
                            deployment.error_msg &&
                            deployment.error_msg != ''
                        ) {
                            this.deploymentHasError = true;
                        }
                        if (deployment.description == '') {
                            deployment.description = '-';
                        }
                        this.statusBadge = getDeploymentBadge(
                            deployment.status
                        );
                        this.deployment = deployment;
                    });
            } else {
                this.deploymentsService
                    .getDeploymentByUUID(this.data.uuid)
                    .subscribe((deployment: Deployment) => {
                        this.isLoading = false;
                        if (
                            deployment.error_msg &&
                            deployment.error_msg != ''
                        ) {
                            this.deploymentHasError = true;
                        }
                        if (deployment.description == '') {
                            deployment.description = '-';
                        }
                        this.statusBadge = getDeploymentBadge(
                            deployment.status
                        );
                        this.deployment = deployment;
                    });
            }
        }
    }

    getResourceValue(resource: KeyValue<string, number>): string {
        const resourceValue = resource.value.toString();
        if (resource.key.includes('MB')) {
            return resourceValue.concat(' MB');
        }
        return resourceValue;
    }
}
