// huggingface-callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
    selector: 'app-huggingface-callback',
    templateUrl: './hugging-face-callback.component.html',
    styleUrls: ['./hugging-face-callback.component.scss'],
})
export class HuggingFaceCallbackComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private profileService: ProfileService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const code = params['code'];
            const state = params['state'];

            if (code && state) {
                this.profileService
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
