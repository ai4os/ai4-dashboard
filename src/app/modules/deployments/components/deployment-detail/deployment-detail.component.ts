import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    Location,
    NgClass,
    KeyValue,
    KeyValuePipe,
    UpperCasePipe,
    DatePipe,
} from '@angular/common';
import { Deployment } from '@app/shared/interfaces/deployment.interface';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { getDeploymentBadge } from '../../utils/deployment-badge';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { SecretsService } from '../../services/secrets-service/secrets.service';
import { SecretField } from '@app/modules/inference/components/inference-detail/inference-detail.component';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { BatchService } from '@app/modules/batch/services/batch.service';
import { CopyToClipboardDirective } from '../../../../shared/directives/copy-to-clipboard.directive';
import { TextEditorComponent } from '../../../../shared/components/text-editor/text-editor.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import {
    ChipVariant,
    UiChipComponent,
} from '@app/shared/components/ui/ui-chip/ui-chip.component';
import {
    UiTabsComponent,
    Tab,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import { UiListCardComponent } from '@app/shared/components/ui/ui-list-card/ui-list-card.component';
import { MatIcon } from '@angular/material/icon';
import { UiCredentialRowComponent } from '@app/shared/components/ui/ui-credential-row/ui-credential-row.component';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { StatsReducedCardComponent } from '@app/modules/statistics/components/stats/stats-reduced-card/stats-reduced-card.component';
import { MatDivider } from '@angular/material/divider';
import { FootprintChartComponent } from '@app/modules/statistics/components/charts/footprint-chart/footprint-chart.component';

interface ListCardItem {
    label: string;
    value: string;
}

@Component({
    selector: 'app-deployment-detail',
    standalone: true,
    templateUrl: './deployment-detail.component.html',
    styleUrls: ['./deployment-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        NgClass,
        KeyValuePipe,
        UpperCasePipe,
        TranslatePipe,
        CopyToClipboardDirective,
        TextEditorComponent,
        UiLoaderComponent,
        UiBannerComponent,
        UiCardComponent,
        UiButtonComponent,
        UiChipComponent,
        UiTabsComponent,
        UiListCardComponent,
        MatIcon,
        UiCredentialRowComponent,
        BreadcrumbComponent,
        StatsReducedCardComponent,
        MatDivider,
        FootprintChartComponent,
        DatePipe,
    ],
})
export class DeploymentDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);

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

    uuid = '';
    type: 'module' | 'tool' | 'batch' = 'module';

    deployment: Deployment | undefined;
    statusBadge = '';

    isLoading = false;
    protected deploymentHasError = false;
    tokenField: SecretField = {
        value: '',
        hide: true,
    };

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

    get tabs(): Tab[] {
        const dynamicTabs: Tab[] = [
            { id: 'overview', label: 'DEPLOYMENTS.OVERVIEW.TITLE' },
        ];

        if (this.deployment?.energy) {
            dynamicTabs.push({
                id: 'energy',
                label: 'DEPLOYMENTS.ENERGY.TITLE',
            });
        }

        if (this.type === 'batch' && this.localBatchScript) {
            dynamicTabs.push({
                id: 'command',
                label: 'DEPLOYMENTS.DEPLOYMENT-DETAIL.BATCH.COMMAND',
            });
        }

        return dynamicTabs;
    }

    activeTabId = 'overview';

    onTabChange(tabId: string): void {
        this.activeTabId = tabId;
    }

    get energyItems(): any[] {
        const acc = this.deployment?.energy?.accumulated;
        if (!acc) return [];

        const formatMetric = (val: number): string => {
            if (val === 0) return '0';
            if (val < 0.01) return val.toExponential(2);
            return val.toFixed(2);
        };

        return [
            {
                label: 'DEPLOYMENTS.ENERGY.POWER-INSTANT',
                value: formatMetric(acc.power_w),
                unit: 'W',
                icon: 'bolt',
                color: 'var(--color-secondary-1)',
            },
            {
                label: 'DEPLOYMENTS.ENERGY.ENERGY-CONSUMED',
                value: formatMetric(acc.energy_wh),
                unit: 'Wh',
                icon: 'battery_charging_full',
                color: 'var(--color-secondary-2)',
            },
            {
                label: 'DEPLOYMENTS.ENERGY.CARBON-FOOTPRINT',
                value: formatMetric(acc.carbon_g),
                unit: 'g CO₂',
                icon: 'factory',
                color: 'var(--color-secondary-5)',
            },
            {
                label: 'DEPLOYMENTS.ENERGY.WATER-FOOTPRINT',
                value: formatMetric(acc.water_l),
                unit: 'L',
                icon: 'water_drop',
                color: 'var(--color-secondary-3)',
            },
        ];
    }

    get energyTimestamps(): string[] {
        const series = this.deployment?.energy?.series;
        if (!series) return [];

        return series.map((s) => {
            const date = new Date(s.ts);
            return date.toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC',
            });
        });
    }

    get energyChartLegend(): string[] {
        return [this.deployment?.datacenter ?? 'Datacenter'];
    }

    get powerSeriesValues(): number[][] {
        const series = this.deployment?.energy?.series;
        return series ? [series.map((s) => s.power_w)] : [];
    }

    get energySeriesValues(): number[][] {
        const series = this.deployment?.energy?.series;
        return series ? [series.map((s) => s.energy_wh)] : [];
    }

    get carbonSeriesValues(): number[][] {
        const series = this.deployment?.energy?.series;
        return series ? [series.map((s) => s.carbon_g)] : [];
    }

    get waterSeriesValues(): number[][] {
        const series = this.deployment?.energy?.series;
        return series ? [series.map((s) => s.water_l)] : [];
    }

    isActiveEndPoint(endpoint: string) {
        return (
            this.deployment?.active_endpoints &&
            this.deployment.active_endpoints.indexOf(endpoint) > -1
        );
    }

    ngOnInit(): void {
        this.uuid = this.route.snapshot.paramMap.get('uuid') ?? '';
        this.type =
            (this.route.snapshot.queryParamMap.get('type') as
                'module' | 'tool' | 'batch') ?? 'module';

        if (!this.uuid) {
            return;
        }

        this.isLoading = true;

        if (this.type === 'tool') {
            this.deploymentsService
                .getToolByUUID(this.uuid)
                .subscribe((deployment: Deployment) => {
                    this.handleDeploymentLoaded(deployment);
                    if (deployment.tool_name === 'ai4os-llm') {
                        this.getVllmKey();
                    } else {
                        this.isLoading = false;
                    }
                });
        } else if (this.type === 'module') {
            this.deploymentsService
                .getDeploymentByUUID(this.uuid)
                .subscribe((deployment: Deployment) => {
                    this.normalizeDockerImage(deployment);
                    this.handleDeploymentLoaded(deployment);
                    this.isLoading = false;
                });
        } else if (this.type === 'batch') {
            this.batchService
                .getBatchDeploymentByUUID(this.uuid)
                .subscribe((deployment: Deployment) => {
                    this.normalizeDockerImage(deployment);
                    this.handleDeploymentLoaded(deployment);
                    this.isLoading = false;
                });
        }
    }

    private handleDeploymentLoaded(deployment: Deployment): void {
        if (deployment.error_msg && deployment.error_msg != '') {
            this.deploymentHasError = true;
        }
        if (deployment.description == '') {
            deployment.description = '-';
        }
        deployment.datacenter ??= '-';
        this.statusBadge = getDeploymentBadge(deployment.status);
        this.deployment = deployment;
    }

    private normalizeDockerImage(deployment: Deployment): void {
        const containerName = deployment.docker_image.includes('user-snapshots')
            ? deployment.docker_image.split(':')[1]
            : deployment.docker_image;
        deployment.docker_image = containerName;
    }

    get localBatchScript(): string | undefined {
        return this.deployment?.templates?.['local/batch.sh'];
    }

    get deploymentInfoItems(): ListCardItem[] {
        return [
            {
                label: this.translateService.instant(
                    'DEPLOYMENTS.DEPLOYMENT-DETAIL.DESCRIPTION'
                ),
                value: this.deployment?.description ?? '-',
            },
            {
                label: this.translateService.instant(
                    'DEPLOYMENTS.DEPLOYMENT-DETAIL.DOCKER-IMAGE'
                ),
                value: this.deployment?.docker_image ?? '-',
            },
        ];
    }

    get resourceItems(): any[] {
        const resources = this.deployment?.resources ?? {};
        return Object.entries(resources).map(([key, value]) => {
            const label = this.translateService.instant(
                'DEPLOYMENTS.DEPLOYMENT-DETAIL.RESOURCES.' + key.toUpperCase()
            );
            let unit = '';
            let icon = 'developer_board';

            const keyLower = key.toLowerCase();
            if (keyLower.includes('mb')) {
                unit = 'MB';
                icon = 'storage';
            } else if (keyLower.includes('mhz')) {
                unit = 'MHz';
                icon = 'speed';
            } else if (keyLower.includes('gpu')) {
                icon = 'memory';
            }

            return { label, value, unit, icon };
        });
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

    getStatusChipVariant(): ChipVariant {
        switch (this.deployment?.status) {
            case 'running':
                return 'success-solid';
            case 'stopped':
                return 'default-solid';
            case 'failed':
            case 'error':
                return 'danger-solid';
            default:
                return 'secondary-1-solid';
        }
    }

    getVllmKey() {
        const subpath = '/deployments/' + this.uuid + '/llm';
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
