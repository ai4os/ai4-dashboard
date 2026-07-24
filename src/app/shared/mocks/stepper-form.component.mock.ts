import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stepper-form',
    standalone: true,
    template: '',
})
export class MockStepperFormComponent {
    @Input() title!: string;
    @Input() step1Title!: string;
    @Input() step2Title!: string;
    @Input() step3Title!: string;
    @Input() showHelp!: boolean;
    @Input() showLoader!: boolean;

    @Input() generalForm: any;
    @Input() hardwareForm: any;
    @Input() storageForm: any;

    @Input() warningMessage!: string;
}
