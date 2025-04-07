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

    // Federated learning with NVFlare
    nvFlareTool() {
        if (
            this.checkIfTourHasShown('nvFlareToolTour') === 'true' ||
            !this.isLoggedIn()
        ) {
            return;
        }

        this.introJS
            .setOptions({
                steps: [
                    {
                        title: 'New NVFlare tool 🎓🌐',
                        intro: 'You can use this tool to adapt existing ML/DL workflows to a federated paradigm.',
                    },
                    {
                        element: '#step1',
                        title: 'New NVFlare tool 🎓🌐',
                        intro: 'It enables platform developers to build a secure, privacy-preserving offering for a distributed multi-party collaboration.',
                        position: 'bottom',
                    },
                ],
            })
            .start();

        this.introJS.onexit(() => {
            localStorage.setItem('nvFlareToolTour', 'true');
        });

        this.introJS.oncomplete(() => {
            localStorage.setItem('nvFlareToolTour', 'true');
        });
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
}
