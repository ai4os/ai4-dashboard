import { MediaMatcher } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-stepper-form',
    templateUrl: './stepper-form.component.html',
    styleUrls: ['./stepper-form.component.scss'],
})
export class StepperFormComponent implements OnInit {
    constructor(
        private _formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.cdr.detectChanges();
    }

    @Input() title!: string;
    @Input() step1!: TemplateRef<unknown>;
    @Input() step2!: TemplateRef<unknown>;
    @Input() step3!: TemplateRef<unknown>;
    @Input() step1Form!: FormGroup;
    @Input() step2Form!: FormGroup;
    @Input() step3Form!: FormGroup;
    @Input() step1Title!: string;
    @Input() step2Title!: string;
    @Input() step3Title!: string;
    @Input() isLoading!: boolean;

    @Output() showHelpButtonEvent = new EventEmitter<MatSlideToggleChange>();
    @Output() submitEvent = new EventEmitter<boolean>();

    @ViewChild('showHelpToggle', { read: ElementRef }) element:
        | ElementRef
        | undefined;

    showHelpForm: FormGroup = this._formBuilder.group({
        showHelpToggleButton: false,
    });
    isFormValid = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    checkFormValidity(form: FormGroup) {
        return form.valid;
    }

    showHelpButtonChange(event: MatSlideToggleChange) {
        this.showHelpButtonEvent.emit(event);
    }

    submitTrainingRequest() {
        this.submitEvent.emit(true);
    }

    getStepperOrientation(): StepperOrientation {
        let orientation = 'horizontal' as StepperOrientation;
        if (this.mobileQuery.matches) {
            orientation = 'vertical';
        }
        return orientation;
    }
}
