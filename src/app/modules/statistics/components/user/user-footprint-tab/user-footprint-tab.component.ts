import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { EnergyViewModel } from '@app/shared/models/stats.view-models';
import { EnergyFootprintComponent } from '../../common/energy-footprint/energy-footprint.component';
import { EnergyGroup } from '@app/modules/statistics/energy-footprint';

@Component({
    selector: 'app-user-footprint-tab',
    templateUrl: './user-footprint-tab.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [EnergyFootprintComponent, TranslatePipe],
})
export class UserFootprintTabComponent implements OnChanges {
    @Input() energy: EnergyViewModel | null = null;

    groups: EnergyGroup[] = [];

    ngOnChanges(): void {
        this.groups = this.energy
            ? [{ name: 'user', points: this.energy.series }]
            : [];
    }
}
