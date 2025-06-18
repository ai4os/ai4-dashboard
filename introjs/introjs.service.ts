import { Injectable } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import introJs from 'intro.js';

@Injectable({
    providedIn: 'root',
})
export class IntroJSService {
    constructor(protected authService: AuthService) {}

    introJS = introJs();

    checkIfTourHasShown(tourName: string): string {
        return localStorage.getItem(tourName) ?? 'false';
    }

    // Batch deployments
    batchDeployments() {
        if (
            this.checkIfTourHasShown('batchDeploymentsTour') === 'true' ||
            !this.isLoggedIn()
        ) {
            return;
        }

        this.introJS
            .setOptions({
                steps: [
                    {
                        title: 'New batch mode training! 📦',
                        intro: 'This training creates a temporary job that is killed after the training is completed.',
                    },
                    {
                        element: '#step1',
                        title: 'New batch mode training! 📦',
                        intro: 'You can deploy any existing module in the marketplace. To create a batch job, click on the Batch button in the module detail.',
                        position: 'bottom',
                    },
                    {
                        element: '#step2',
                        title: 'New batch mode training! 📦',
                        intro: 'It is also possible to redeploy from a snapshot. After creating one, go to the snapshot table and click on redeploy.',
                        position: 'bottom',
                    },
                    {
                        element: '#step3',
                        title: 'New batch mode training! 📦',
                        intro: 'Keep track of your current batch jobs, as well as the batch jobs that completed in the last 24 hours, in the Batch training section.',
                        position: 'bottom',
                    },
                ],
            })
            .start();

        this.introJS.onexit(() => {
            localStorage.setItem('batchDeploymentsTour', 'true');
        });

        this.introJS.oncomplete(() => {
            localStorage.setItem('batchDeploymentsTour', 'true');
        });
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
}
