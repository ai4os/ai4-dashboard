import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatCardContent, TranslatePipe],
})
export class NotFoundComponent {}
