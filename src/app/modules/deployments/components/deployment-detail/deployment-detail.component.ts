import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { getDeploymentBadge } from '../../utils/deployment-badge';
import { KeyValue } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { SecretField } from '@app/modules/inference/components/inference-detail/inference-detail.component';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

@Component({
    selector: 'app-deployment-detail',
    templateUrl: './deployment-detail.component.html',
    styleUrls: ['./deployment-detail.component.scss'],
})
export class DeploymentDetailComponent implements OnInit {
    constructor(
        private deploymentsService: DeploymentsService,
        private secretsService: SecretsService,
        public translateService: TranslateService,
        private snackbarService: SnackbarService,
        public confirmationDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: { uuid: string; isTool: boolean },
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    deployment: Deployment | undefined;
    statusBadge = '';

    isLoading = false;
    protected deploymentHasError = false;
    tokenField: SecretField = {
        value: '',
        hide: true,
    };

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

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
                        if (
                            deployment.error_msg &&
                            deployment.error_msg != ''
                        ) {
                            this.deploymentHasError = true;
                        }
                        if (deployment.description == '') {
                            deployment.description = '-';
                        }
                        if (deployment.datacenter == null) {
                            deployment.datacenter = '-';
                        }
                        this.statusBadge = getDeploymentBadge(
                            deployment.status
                        );
                        this.deployment = deployment;

                        if (deployment.tool_name === 'ai4os-llm') {
                            this.getVllmKey();
                        } else {
                            this.isLoading = false;
                        }
                    });
            } else {
                this.deploymentsService
                    .getDeploymentByUUID(this.data.uuid)
                    .subscribe((deployment: Deployment) => {
                        if (
                            deployment.error_msg &&
                            deployment.error_msg != ''
                        ) {
                            this.deploymentHasError = true;
                        }
                        if (deployment.description == '') {
                            deployment.description = '-';
                        }
                        if (deployment.datacenter == null) {
                            deployment.datacenter = '-';
                        }
                        const conatinerName = deployment.docker_image.includes(
                            'user-snapshots'
                        )
                            ? deployment.docker_image.split(':')[1]
                            : deployment.docker_image;
                        deployment.docker_image = conatinerName;
                        this.statusBadge = getDeploymentBadge(
                            deployment.status
                        );

                        this.deployment = deployment;

                        this.isLoading = false;
                    });
            }
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

    getVllmKey() {
        const subpath = '/deployments/' + this.data.uuid + '/llm';
        this.secretsService.getSecrets(subpath).subscribe({
            next: (tokens) => {
                this.tokenField.value = Object.values(tokens)[0].token ?? '';
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve VLLM Token. Please try again later."
                );
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    }
}
