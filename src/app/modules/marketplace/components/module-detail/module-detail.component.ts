import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { ModulesService } from '../../services/modules-service/modules.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Module } from '@app/shared/interfaces/module.interface';
import { ToolsService } from '../../services/tools-service/tools.service';
import { Location } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { OscarInferenceService } from '@app/modules/inference/services/oscar-inference.service';
import { OscarServiceRequest } from '@app/shared/interfaces/oscar-service.interface';
import { timer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

@Component({
    selector: 'app-module-detail',
    templateUrl: './module-detail.component.html',
    styleUrls: ['./module-detail.component.scss'],
})
export class ModuleDetailComponent implements OnInit {
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

    modulesList = [];
    module!: Module;
    userProfile?: UserProfile;
    popupWindow: Window | undefined | null;

    isLoading = false;
    isInferenceModule = false;
    isTool = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    private stopPolling$ = timer(180000);

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.isLoading = true;
            this.authService.userProfileSubject.subscribe((profile) => {
                this.userProfile = profile;
            });

            if (this.isTool) {
                this.toolsService.getTool(params['id']).subscribe((tool) => {
                    this.isLoading = false;
                    this.module = tool;
                    this.breadcrumbService.set('@moduleName', tool.title);
                });
            } else {
                this.modulesService
                    .getModule(params['id'])
                    .subscribe((module) => {
                        this.isLoading = false;
                        this.module = module;
                        this.breadcrumbService.set('@moduleName', module.title);
                        this.isInferenceModule =
                            module.keywords.includes('inference');
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

    createOscarService() {
        this.isLoading = true;
        const requestBody: OscarServiceRequest = {
            allowed_users: [],
            cpu: 2,
            image: this.module.sources.docker_registry_repo,
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
                                    'Oscar service created with name ' +
                                        serviceName
                                );
                            } else {
                                this.snackbarService.openError(
                                    'Error while creating service with name ' +
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
        this.router.navigate(['train'], {
            relativeTo: this.route,
            state: { service: service },
        });
    }
}
