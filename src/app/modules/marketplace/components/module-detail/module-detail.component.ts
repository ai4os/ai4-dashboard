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
import { MatSnackBar } from '@angular/material/snack-bar';
import { OscarServiceRequest } from '@app/shared/interfaces/oscar-service.interface';

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
        public location: Location,
        private router: Router,
        private _snackBar: MatSnackBar,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        authService.userProfileSubject.subscribe((profile) => {
            this.userProfile = profile;
        });
        if (this.location.path().includes('tools')) {
            this.isTool = true;
        }

        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    modulesList = [];
    module!: Module;
    userProfile?: UserProfile;

    isLoading = false;
    isInferenceModule = false;
    isTool = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    isLoggedIn() {
        return this.authService.isAuthenticated();
    }

    isAuthorized() {
        return this.userProfile?.isAuthorized;
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.isLoading = true;
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

    createOscarService() {
        this.isLoading = true;
        const requestBody: OscarServiceRequest = {
            allowed_users: [],
            cpu: 2,
            image: this.module.sources.docker_registry_repo,
            memory: 3000,
            title: this.module.title,
        };

        this.oscarInferenceService.createService(requestBody).subscribe({
            next: (serviceName: string) => {
                this.isLoading = false;
                if (serviceName != '') {
                    this.router
                        .navigate(['/inference'])
                        .then((navigated: boolean) => {
                            if (navigated) {
                                this._snackBar.open(
                                    'Oscar service created with name ' +
                                        serviceName,
                                    '×',
                                    {
                                        duration: 3000,
                                        panelClass: ['success-snackbar'],
                                    }
                                );
                            } else {
                                this._snackBar.open(
                                    'Error while creating service with name ' +
                                        serviceName,
                                    '×',
                                    {
                                        duration: 3000,
                                        panelClass: ['red-snackbar'],
                                    }
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
}
