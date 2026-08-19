import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { ModulesService } from '../../../services/modules-service/modules.service';
import { BreadcrumbService, BreadcrumbComponent } from 'xng-breadcrumb';
import { Ai4eoscModule } from '@app/shared/interfaces/module.interface';
import { ToolsService } from '../../../services/tools-service/tools.service';
import { Location, NgClass } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { IframeDialogComponent } from '@app/shared/components/iframe-dialog/iframe-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MarkdownComponent } from 'ngx-markdown';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import { UiChipComponent } from '@app/shared/components/ui/ui-chip/ui-chip.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';

@Component({
    selector: 'app-module-detail',
    templateUrl: './ai4eosc-module-detail.component.html',
    styleUrls: ['./ai4eosc-module-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatIcon,
        BreadcrumbComponent,
        NgClass,
        MatTooltip,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem,
        RouterLink,
        MarkdownComponent,
        TranslatePipe,
        UiBannerComponent,
        UiCardComponent,
        UiChipComponent,
        UiButtonComponent,
        UiLoaderComponent,
    ],
})
export class Ai4eoscModuleDetailComponent implements OnInit {
    private modulesService = inject(ModulesService);
    private toolsService = inject(ToolsService);
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private breadcrumbService = inject(BreadcrumbService);
    translateService = inject(TranslateService);
    dialog = inject(MatDialog);
    location = inject(Location);
    private router = inject(Router);
    private changeDetectorRef = inject(ChangeDetectorRef);
    private media = inject(MediaMatcher);

    constructor() {
        const authService = this.authService;
        const changeDetectorRef = this.changeDetectorRef;

        if (this.location.path().includes('tools')) {
            this.isTool = true;
        }
        if (authService.isAuthenticated()) {
            authService.loadUserProfile();
        }
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    module!: Ai4eoscModule;
    userProfile?: UserProfile;
    popupWindow: Window | undefined | null;
    doiBadgeColor = '';

    dataIconDict: Record<string, string> = {
        Image: 'image',
        Text: 'description',
        'Time Series': 'show_chart',
        Tabular: 'table_chart',
        Graph: 'grouped_bar_chart',
        Audio: 'music_note',
        Video: 'videocam',
        Other: '',
    };

    isLoading = false;
    isTool = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    ngOnInit(): void {
        // scroll to top
        setTimeout(() => {
            const content = document.querySelector(
                '.sidenav-content'
            ) as HTMLElement;
            if (content) {
                content.scrollTop = 0;
            }
        }, 100);

        const r = document.querySelector(':root');
        const rs = getComputedStyle(r!);
        this.doiBadgeColor = rs.getPropertyValue('--primary');

        this.route.params.subscribe((params) => {
            this.isLoading = true;
            this.authService.userProfile$.subscribe((profile) => {
                if (profile) {
                    this.userProfile = profile;
                    this.changeDetectorRef.detectChanges();
                }
            });

            if (this.isTool) {
                this.toolsService.getTool(params['id']).subscribe((tool) => {
                    this.module = tool;
                    this.module.description = this.cleanMarkdown(
                        this.module.description
                    );
                    this.breadcrumbService.set('@moduleName', tool.title);
                    this.isLoading = false;
                });
            } else {
                this.modulesService
                    .getModule(params['id'])
                    .subscribe((module) => {
                        this.module = module;
                        this.module.description = this.cleanMarkdown(
                            this.module.description
                        );
                        this.breadcrumbService.set('@moduleName', module.title);
                        this.isLoading = false;
                    });
            }
        });
    }

    isLoggedIn() {
        return this.authService.isAuthenticated();
    }

    isAuthenticated() {
        return this.userProfile?.isAuthenticated;
    }

    isAuthorized() {
        return this.userProfile?.isAuthorized;
    }

    isProjectMember() {
        return this.userProfile?.isProjectMember;
    }

    convertTypeToIcon(dataType: string): string {
        return this.dataIconDict[dataType];
    }

    getDOIBadgeUrl(doiUrl: string) {
        return (
            'https://img.shields.io/badge/DOI-' +
            doiUrl.replace('https://doi.org/', '') +
            '-' +
            this.doiBadgeColor.replace('#', '')
        );
    }

    createGradioDeployment() {
        sessionStorage.setItem('moduleData', JSON.stringify(this.module));
        window.open(`${window.location.href}/try-me-nomad`);
    }

    trainModuleCodespaces(service: string) {
        this.router.navigate(['deploy'], {
            relativeTo: this.route,
            state: { service: service },
        });
    }

    trainModulePlatform(platform: string) {
        this.router.navigate(['deploy'], {
            relativeTo: this.route,
            state: { platform: platform },
        });
    }

    openProvenanceIframeDialog(): void {
        const url =
            'https://provenance.cloud.ai4eosc.eu/?applicationId=' +
            this.module.id;

        this.dialog.open(IframeDialogComponent, {
            data: { url: url },
            width: '80vw',
            height: '80vh',
        });
    }

    deployBatch() {
        this.router.navigate(['batch'], {
            relativeTo: this.route,
        });
    }

    downloadMetadata(format: string): void {
        this.modulesService.openMetadataInNewTab(this.module.id, format);
    }

    openLicenseVocab(license: string) {
        const url = `https://op.europa.eu/en/web/eu-vocabularies/concept/-/resource?uri=http://publications.europa.eu/resource/authority/licence/${license}`;
        window.open(url);
    }

    private cleanMarkdown(text: string): string {
        if (!text) return '';
        // Searches for '<img... src="" and removes the comma so that it becomes valid HTML
        // (the API returns invalid HTML)
        return text.replace(/<img([^>]+?),\s*src=/gi, '<img$1 src=');
    }
}
