import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { ModulesService } from '../../../services/modules-service/modules.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Ai4eoscModule } from '@app/shared/interfaces/module.interface';
import { ToolsService } from '../../../services/tools-service/tools.service';
import { Location } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { OscarInferenceService } from '@app/modules/inference/services/oscar-inference.service';
import { OscarServiceRequest } from '@app/shared/interfaces/oscar-service.interface';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

@Component({
    selector: 'app-module-detail',
    templateUrl: './ai4eosc-module-detail.component.html',
    styleUrls: ['./ai4eosc-module-detail.component.scss'],
})
export class Ai4eoscModuleDetailComponent implements OnInit {
    constructor(
        private modulesService: ModulesService,
        private toolsService: ToolsService,
        private oscarInferenceService: OscarInferenceService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private breadcrumbService: BreadcrumbService,
        public translateService: TranslateService,
        public location: Location,
        private router: Router,
        private snackbarService: SnackbarService,
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

    createOscarService() {
        this.isLoading = true;
        const requestBody: OscarServiceRequest = {
            allowed_users: [],
            cpu: 2,
            image: this.module.links.docker_image!,
            memory: 3000,
            title: uniqueNamesGenerator({
                dictionaries: [colors, animals],
            }),
        };
        this.oscarInferenceService.createService(requestBody).subscribe({
            next: (serviceName: string) => {
                this.isLoading = false;
                if (serviceName != '') {
                    this.router
                        .navigate(['/inference'])
                        .then((navigated: boolean) => {
                            if (navigated) {
                                this.snackbarService.openSuccess(
                                    'OSCAR service created with uuid ' +
                                        serviceName
                                );
                            } else {
                                this.snackbarService.openError(
                                    'Error while creating service with uuid ' +
                                        serviceName
                                );
                            }
                        });
                }
            },
            error: () => {
                this.isLoading = false;
            },
        });
    }

    createGradioDeployment() {
        sessionStorage.setItem('moduleData', JSON.stringify(this.module));
        window.open(`${window.location.href}/try-me-nomad`);
    }

    trainModule(service: string) {
        this.router.navigate(['deploy'], {
            relativeTo: this.route,
            state: { service: service },
        });
    }
}
