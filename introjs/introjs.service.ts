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

    // New LLM tool
    llmTool() {
        if (this.checkIfTourHasShown('llmToolTour') === 'true') {
            return;
        }

        this.introJS
            .setOptions({
                steps: [
                    {
                        title: 'New LLM tool 🧠💬',
                        intro: 'Check out the new LLM tool!',
                    },
                    {
                        element: '#step1',
                        title: 'New LLM tool 🧠💬',
                        intro: 'This tool enables you to launch and manage your own LLM instances using VLLM and OpenWebUI.',
                        position: 'bottom',
                    },
                ],
            })
            .start();

        this.introJS.onexit(() => {
            localStorage.setItem('llmToolTour', 'true');
        });

        this.introJS.oncomplete(() => {
            localStorage.setItem('llmToolTour', 'true');
        });
    }
}
