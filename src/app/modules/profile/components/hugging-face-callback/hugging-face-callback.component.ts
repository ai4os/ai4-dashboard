import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HuggingFaceService } from '../../services/hugging-face-service/hugging-face.service';

@Component({
    selector: 'app-huggingface-callback',
    templateUrl: './hugging-face-callback.component.html',
})
export class HuggingFaceCallbackComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {}

    huggingFaceService = inject(HuggingFaceService);

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const code = params['code'];
            const state = params['state'];

            if (code && state) {
                this.huggingFaceService
                    .validateOAuthRedirect(code, state)
                    .subscribe({
                        next: () => this.router.navigate(['/profile']),
                        error: () => this.router.navigate(['/profile']),
                    });
            } else {
                this.router.navigate(['/profile']);
            }
        });
    }
}
