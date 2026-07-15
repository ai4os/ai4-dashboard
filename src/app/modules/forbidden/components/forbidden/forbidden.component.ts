import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-forbidden',
    templateUrl: './forbidden.component.html',
    styleUrls: ['./forbidden.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatCardContent],
})
export class ForbiddenComponent implements OnInit {
    route = inject(ActivatedRoute);

    errorMessage = '';

    ngOnInit(): void {
        this.errorMessage =
            this.route.snapshot.paramMap.get('errorMessage') || '';
    }
}
