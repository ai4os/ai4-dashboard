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

    /*  
        EXAMPLE OF USAGE 
        TODO: DELETE THIS WHEN THE FIRST TOUR IS CREATED
    */

    // modulesList() {
    //     if (this.checkIfTourHasShown('modulesListTour') === 'true') {
    //         return;
    //     }

    //     this.introJS
    //         .setOptions({
    //             steps: [
    //                 {
    //                     element: '#step1',
    //                     intro: 'Search your favourite modules here',
    //                 },
    //                 {
    //                     element: '#step2',
    //                     intro: 'Check how filters are applied and manage them here',
    //                 },
    //                 {
    //                     element: '#step3',
    //                     intro: 'Sort them using this chips.',
    //                 },
    //             ],
    //             scrollToElement: false,
    //         })
    //         .start();

    //     this.introJS.onexit(() => {
    //         localStorage.setItem('modulesListTour', 'true');
    //     });

    //     this.introJS.oncomplete(() => {
    //         localStorage.setItem('modulesListTour', 'true');
    //     });
    // }
}
