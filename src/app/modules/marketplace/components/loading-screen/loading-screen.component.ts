import { Component, OnInit } from '@angular/core';
import {
    GradioCreateResponse,
    GradioDeployment,
    Module,
} from '@app/shared/interfaces/module.interface';
import { TranslateService } from '@ngx-translate/core';
import {
    interval,
    switchMap,
    catchError,
    of,
    takeUntil,
    takeWhile,
    finalize,
    timer,
} from 'rxjs';
import { ModulesService } from '../../services/modules-service/modules.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent implements OnInit {
    constructor(
        private modulesService: ModulesService,
        public translateService: TranslateService,
        private snackbarService: SnackbarService
    ) {}

    module!: Module;
    loadingText = '';

    private stopPolling$ = timer(180000);
    isLoading = true;

    ngOnInit(): void {
        this.translateService
            .get('MODULES.MODULE-DETAIL.INIT-STATUS-GRADIO')
            .subscribe((translatedText: string) => {
                this.loadingText = translatedText;
            });

        const data = sessionStorage.getItem('moduleData');
        if (data) {
            try {
                this.module = JSON.parse(data);
                this.createGradioDeployment();
            } catch (e) {
                this.closeWindowDueError(
                    'Error initializing the deployment. Please try again later.'
                );
            }
        } else {
            this.closeWindowDueError(
                'Error initializing the deployment. Please try again later.'
            );
        }
    }

    closeWindowDueError(error: string) {
        this.loadingText = '';
        this.snackbarService.openError(error);
        setTimeout(function () {
            window.close();
        }, 3000);
    }

    createGradioDeployment() {
        const moduleName =
            this.module.sources.docker_registry_repo.split('/')[1];

        this.modulesService.createDeploymentGradio(moduleName).subscribe({
            next: (response: GradioCreateResponse) => {
                if (response.status === 'success') {
                    this.pollGradioDeploymentStatus(response.job_ID);
                } else {
                    this.closeWindowDueError(
                        'Error initializing the deployment. Please try again later.'
                    );
                }
            },
            error: () => {
                this.loadingText = '';
                setTimeout(function () {
                    window.close();
                }, 6000);
            },
        });
    }

    pollGradioDeploymentStatus(jobId: string) {
        interval(2000) // Intervalo de 2 segundos
            .pipe(
                switchMap(() =>
                    this.modulesService.getDeploymentGradio(jobId).pipe(
                        catchError((error) => {
                            return of(error);
                        })
                    )
                ),
                takeUntil(this.stopPolling$),
                takeWhile(
                    (response) => response.active_endpoints.length === 0,
                    true
                ),
                finalize(() => {
                    if (this.isLoading === true) {
                        this.snackbarService.openError(
                            'Error initializing the deployment'
                        );
                    }
                })
            )
            .subscribe({
                next: (response: GradioDeployment) => {
                    if (response.active_endpoints.length !== 0) {
                        if (window) {
                            this.isLoading = false;
                            window.location.href = response.endpoints.ui;
                        }
                    } else {
                        if (response.status === 'starting') {
                            this.loadingText = this.translateService.instant(
                                'MODULES.MODULE-DETAIL.INIT-STATUS-GRADIO'
                            );
                        } else if (response.status === 'running') {
                            this.loadingText = this.translateService.instant(
                                'MODULES.MODULE-DETAIL.ACTIVATING-STATUS-GRADIO'
                            );
                        } else {
                            this.closeWindowDueError(
                                'Sorry, it seems we were unable to launch this module.'
                            );
                        }
                    }
                },
                error: () => {
                    this.closeWindowDueError(
                        'Error initializing the deployment. Please try again later.'
                    );
                },
            });
    }
}
