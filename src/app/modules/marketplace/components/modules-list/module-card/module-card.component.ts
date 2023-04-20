import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-module-card',
  templateUrl: './module-card.component.html',
  styleUrls: ['./module-card.component.scss']
})
export class ModuleCardComponent {

    // This property is bound using its original name.
    @Input() module: any;

}
