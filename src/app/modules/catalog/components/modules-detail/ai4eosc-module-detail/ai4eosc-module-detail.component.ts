import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { ModulesService } from '../../../services/modules-service/modules.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Ai4eoscModule } from '@app/shared/interfaces/module.interface';
import { ToolsService } from '../../../services/tools-service/tools.service';
import { Location } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { IframeDialogComponent } from '@app/shared/components/iframe-dialog/iframe-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-module-detail',
    templateUrl: './ai4eosc-module-detail.component.html',
    styleUrls: ['./ai4eosc-module-detail.component.scss'],
})
export class Ai4eoscModuleDetailComponent implements OnInit {
    constructor(
        private modulesService: ModulesService,
        private toolsService: ToolsService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private breadcrumbService: BreadcrumbService,
        public translateService: TranslateService,
        public dialog: MatDialog,
        public location: Location,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
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

    dataIconDict: { [dataType: string]: string } = {
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
            this.authService.userProfileSubject.subscribe((profile) => {
                this.userProfile = profile;
            });

            if (this.isTool) {
                this.toolsService.getTool(params['id']).subscribe((tool) => {
                    this.module = tool;
                    this.breadcrumbService.set('@moduleName', tool.title);
                    this.isLoading = false;
                });
            } else {
                this.modulesService
                    .getModule(params['id'])
                    .subscribe((module) => {
                        this.module = module;
                        this.breadcrumbService.set('@moduleName', module.title);
                        this.isLoading = false;
                    });
            }
        });
    }

    isLoggedIn() {
        return this.authService.isAuthenticated();
    }

    isAuthorized() {
        return this.userProfile?.isAuthorized;
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
            'https://provenance.services.ai4os.eu/?applicationId=' +
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

    openLicenseVocab(license: string) {
        const url = `https://op.europa.eu/en/web/eu-vocabularies/concept/-/resource?uri=http://publications.europa.eu/resource/authority/licence/${license}`;
        window.open(url);
    }
}
