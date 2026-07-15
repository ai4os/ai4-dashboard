import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-forbidden',
    templateUrl: './forbidden.component.html',
    styleUrls: ['./forbidden.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class ForbiddenComponent implements OnInit {
    route = inject(ActivatedRoute);

    errorMessage = '';

    ngOnInit(): void {
        this.errorMessage =
            this.route.snapshot.paramMap.get('errorMessage') || '';
    }
}
