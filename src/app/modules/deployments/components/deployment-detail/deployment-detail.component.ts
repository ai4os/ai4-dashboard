import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogClose,
} from '@angular/material/dialog';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { getDeploymentBadge } from '../../utils/deployment-badge';
import {
    KeyValue,
    NgClass,
    UpperCasePipe,
    JsonPipe,
    KeyValuePipe,
} from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { SecretField } from '@app/modules/inference/components/inference-detail/inference-detail.component';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { BatchService } from '@app/modules/batch/services/batch.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import {
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
} from '@angular/material/card';
import {
    MatError,
    MatFormField,
    MatInput,
    MatSuffix,
} from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CopyToClipboardDirective } from '../../../../shared/directives/copy-to-clipboard.directive';
import {
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { TextEditorComponent } from '../../../../shared/components/text-editor/text-editor.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-deployment-detail',
    templateUrl: './deployment-detail.component.html',
    styleUrls: ['./deployment-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatToolbar,
        MatIcon,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        NgClass,
        MatCardContent,
        MatError,
        MatList,
        MatListItem,
        MatButton,
        MatFormField,
        MatInput,
        MatIconButton,
        MatTooltip,
        CopyToClipboardDirective,
        MatSuffix,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        TextEditorComponent,
        MatProgressSpinner,
        MatCardActions,
        MatDialogClose,
        UpperCasePipe,
        JsonPipe,
        KeyValuePipe,
        TranslatePipe,
    ],
})
export class DeploymentDetailComponent implements OnInit {
    confirmationDialog = inject(MatDialog);
    data = inject<{
        uuid: string;
        type: string;
    }>(MAT_DIALOG_DATA);

    deploymentsService = inject(DeploymentsService);
    secretsService = inject(SecretsService);
    translateService = inject(TranslateService);
    snackbarService = inject(SnackbarService);
    batchService = inject(BatchService);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
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
            if (this.data.type === 'tool') {
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
            } else if (this.data.type === 'module') {
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
            } else if (this.data.type === 'batch') {
                this.batchService
                    .getBatchDeploymentByUUID(this.data.uuid)
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

    get localBatchScript(): string | undefined {
        return this.deployment?.templates?.['local/batch.sh'];
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
