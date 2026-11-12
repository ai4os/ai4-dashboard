import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { OscarService } from '@app/shared/interfaces/oscar-service.interface';
import { OscarInferenceService } from '../../services/oscar-inference.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { DatePipe } from '@angular/common';
import {
    Tab,
    UiTabsComponent,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import { StatsCardComponent } from '@app/modules/statistics/components/common/stats-card/stats-card.component';
import { UiCredentialRowComponent } from '@app/shared/components/ui/ui-credential-row/ui-credential-row.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';

export interface SecretField {
    value: string;
    hide: boolean;
}

@Component({
    selector: 'app-inference-detail',
    templateUrl: './inference-detail.component.html',
    styleUrls: ['./inference-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        TranslatePipe,
        BreadcrumbComponent,
        UiBannerComponent,
        UiCardComponent,
        UiLoaderComponent,
        DatePipe,
        UiTabsComponent,
        StatsCardComponent,
        UiCredentialRowComponent,
        UiButtonComponent,
    ],
})
export class InferenceDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);
    oscarInferenceService = inject(OscarInferenceService);
    translateService = inject(TranslateService);

    uuid = '';
    isLoading = false;
    service: OscarService | undefined;

    endpointField = '';
    accessKeyField = '';
    minioSecretField = '';

    get tabs(): Tab[] {
        const dynamicTabs: Tab[] = [
            { id: 'overview', label: 'DEPLOYMENTS.OVERVIEW.TITLE' },
            { id: 'calls', label: 'INFERENCE.DETAIL.CALLS' },
        ];

        return dynamicTabs;
    }

    activeTabId = 'overview';

    ngOnInit(): void {
        this.uuid = this.route.snapshot.paramMap.get('uuid') ?? '';
        if (this.uuid) {
            this.getService();
        }
    }

    getService() {
        this.isLoading = true;
        this.oscarInferenceService.getServiceByName(this.uuid).subscribe({
            next: (service: OscarService) => {
                this.service = service;
                this.service.title = service.environment.variables.PAPI_TITLE;
                this.service.description =
                    service.environment.variables.PAPI_DESCRIPTION ?? '';
                this.service.submit_time =
                    service.environment.variables.PAPI_CREATED;
                this.endpointField =
                    service.storage_providers?.minio?.default?.endpoint;
                this.accessKeyField =
                    service.storage_providers.minio.default.access_key;
                this.minioSecretField =
                    service.storage_providers.minio.default.secret_key;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            },
        });
    }

    get resourceItems(): any[] {
        const service = this.service ?? {};
        const desiredOrder = ['cpu', 'memory'];

        return Object.entries(service)
            .filter(([key]) => desiredOrder.includes(key))
            .sort(([keyA], [keyB]) => {
                return desiredOrder.indexOf(keyA) - desiredOrder.indexOf(keyB);
            })
            .map(([key, value]) => {
                const label = this.translateService.instant(
                    'INFERENCE.DETAIL.RESOURCES.' + key.toUpperCase()
                );

                let unit = '';
                let icon = '';
                let color = '';

                if (key === 'memory' && typeof value === 'string') {
                    value = value.replace(/Mi$/, '');
                }

                switch (key.toLowerCase()) {
                    case 'cpu':
                        icon = 'memory';
                        color = 'var(--color-accent)';
                        break;

                    case 'memory':
                        unit = 'MiB';
                        icon = 'memory_alt';
                        color = 'var(--color-secondary-4)';
                        break;
                }

                return { label, value, unit, icon, color };
            });
    }

    onTabChange(tabId: string): void {
        this.activeTabId = tabId;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { tab: tabId === 'overview' ? null : tabId },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }
}
