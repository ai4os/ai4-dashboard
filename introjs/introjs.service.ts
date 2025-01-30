import { Injectable } from '@angular/core';
import introJs from 'intro.js';

@Injectable({
    providedIn: 'root',
})
export class IntroJSService {
    constructor() {}

    introJS = introJs();

    checkIfTourHasShown(tourName: string): string {
        return localStorage.getItem(tourName) ?? 'false';
    }

    // New external marketplaces (AI4Life Marketplace)
    ai4lifeMarketplace() {
        if (this.checkIfTourHasShown('ai4lifeMarketplaceTour') === 'true') {
            return;
        }

        this.introJS
            .setOptions({
                steps: [
                    {
                        title: 'New AI4Life marketplace! 🎉',
                        intro: 'Apart from the main AI4EOSC marketplace, now we also support external marketplaces.',
                    },
                    {
                        element: '#step1',
                        title: 'New AI4Life marketplace! 🎉',
                        intro: "Don't forget to check out the new AI4Life marketplace.",
                        position: 'bottom',
                    },
                    {
                        element: '#step2',
                        title: 'New AI4Life marketplace! 🎉',
                        intro: 'You can also use the AI4life model loader directly.',
                        position: 'bottom',
                    },
                ],
            })
            .start();

        this.introJS.onexit(() => {
            localStorage.setItem('ai4lifeMarketplaceTour', 'true');
        });

        this.introJS.oncomplete(() => {
            localStorage.setItem('ai4lifeMarketplaceTour', 'true');
        });
    }
}
