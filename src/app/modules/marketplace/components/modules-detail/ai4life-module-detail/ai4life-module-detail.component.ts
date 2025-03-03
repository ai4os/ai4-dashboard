import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { ModulesService } from '@app/modules/marketplace/services/modules-service/modules.service';
import { Ai4lifeModule } from '@app/shared/interfaces/module.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
    selector: 'app-ai4life-module-detail',
    templateUrl: './ai4life-module-detail.component.html',
    styleUrl: './ai4life-module-detail.component.scss',
})
export class Ai4lifeModuleDetailComponent implements OnInit {
    constructor(
        private router: Router,
        private authService: AuthService,
        private breadcrumbService: BreadcrumbService,
        private snackbarService: SnackbarService,
        private modulesService: ModulesService,
        private route: ActivatedRoute,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        if (authService.isAuthenticated()) {
            authService.loadUserProfile();
        }

        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    module: Ai4lifeModule = {
        id: '',
        name: '',
        description: '',
        doi: '',
        created: '',
        covers: [],
        downloadCount: '',
        tags: [],
        license: '',
    };

    userProfile?: UserProfile;
    doiBadgeColor = '';

    isLoading = false;

    tagsCollapsed = true;
    tags: string[] = [];

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

            this.modulesService.getAi4lifeModules().subscribe({
                next: (modules: Ai4lifeModule[]) => {
                    const ai4lifeModule =
                        modules.find((m) => m.name === params['name']) ??
                        this.module;

                    if (ai4lifeModule.id !== '') {
                        this.module = ai4lifeModule;
                        this.breadcrumbService.set(
                            '@moduleName',
                            this.module.name
                        );
                        this.module.downloadCount =
                            this.module.downloadCount === '?'
                                ? 'Unknown'
                                : this.module.downloadCount;
                        this.tags = this.module.tags.slice(0, 7);
                    } else {
                        this.snackbarService.openError(
                            "Couldn't retrieve AI4Life model. Try again later."
                        );
                    }

                    this.isLoading = false;
                },
                error: () => {
                    setTimeout(() => (this.isLoading = false), 3000);
                },
            });
        });
    }

    isLoggedIn() {
        return this.authService.isAuthenticated();
    }

    isAuthorized() {
        return this.userProfile?.isAuthorized;
    }

    doiIsValid(): boolean {
        const doiPattern = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        return doiPattern.test(this.module.doi);
    }

    getDOIBadgeUrl(doiUrl: string) {
        return (
            'https://img.shields.io/badge/DOI-' +
            doiUrl.replace('https://doi.org/', '') +
            '-' +
            this.doiBadgeColor.replace('#', '')
        );
    }

    train() {
        this.router.navigate(
            ['marketplace/tools/ai4os-ai4life-loader/deploy'],
            {
                state: { modelId: this.module.id },
            }
        );
    }

    getTags(): string[] {
        return this.tagsCollapsed
            ? this.module.tags.splice(0, 7)
            : this.module.tags;
    }

    toggleEllipsis() {
        this.tagsCollapsed = !this.tagsCollapsed;
        if (this.tagsCollapsed) {
            this.tags = this.module.tags.slice(0, 7);
        } else {
            this.tags = this.module.tags;
        }
    }
}
