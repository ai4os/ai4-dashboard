import { MediaMatcher } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { UiToggleComponent } from '@app/shared/components/ui/ui-toggle/ui-toggle.component';
import { Router } from '@angular/router';
import { DeploymentsService } from '@app/modules/deployments/services/deployments-service/deployments.service';
import { OscarInferenceService } from '@app/modules/inference/services/oscar-inference.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { MatStepper, MatStep, MatStepLabel } from '@angular/material/stepper';
import { TranslatePipe } from '@ngx-translate/core';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { UiChipComponent } from '@app/shared/components/ui/ui-chip/ui-chip.component';

@Component({
    selector: 'app-stepper-form',
    templateUrl: './stepper-form.component.html',
    styleUrls: ['./stepper-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        BreadcrumbComponent,
        UiToggleComponent,
        MatStepper,
        MatStep,
        MatStepLabel,
        NgTemplateOutlet,
        TranslatePipe,
        UiLoaderComponent,
        UiBannerComponent,
        UiButtonComponent,
        UiChipComponent,
    ],
})
export class StepperFormComponent implements OnInit {
    _formBuilder = inject(FormBuilder);
    cdr = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);
    deploymentsService = inject(DeploymentsService);
    oscarInferenceService = inject(OscarInferenceService);
    router = inject(Router);
    snackbarService = inject(SnackbarService);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => this.cdr.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.cdr.detectChanges();

        // scroll to top
        setTimeout(() => {
            const content = document.querySelector(
                '.sidenav-content'
            ) as HTMLElement;
            if (content) {
                content.scrollTop = 0;
            }
        }, 100);
    }

    @Input() title!: string;
    @Input() numberOfSteps!: number;
    @Input() step1!: TemplateRef<unknown>;
    @Input() step2!: TemplateRef<unknown>;
    @Input() step3!: TemplateRef<unknown>;
    @Input() step1Form!: FormGroup;
    @Input() step2Form!: FormGroup;
    @Input() step3Form?: FormGroup;
    @Input() step1Title!: string;
    @Input() step2Title!: string;
    @Input() step3Title?: string;
    @Input() warningMessage?: string = '';
    @Input() platform?: string = 'nomad';
    @Input() isLoading!: boolean;
    /**
     * Non-destructive loading overlay: covers the already-rendered stepper
     * without unmounting it (unlike isLoading). Use this for transient
     * loads triggered by a child form once the stepper is already mounted
     * (e.g. a sub-form fetching a token) — isLoading would tear the child
     * down mid-request and it could never signal completion.
     */
    @Input() fieldsLoading = false;

    @Output() showHelpButtonEvent = new EventEmitter<boolean>();

    @Output() submitted = new EventEmitter<void>();

    showHelpForm: FormGroup = this._formBuilder.group({
        showHelpToggleButton: false,
    });
    isFormValid = false;

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

    checkFormValidity(form: FormGroup) {
        if (form) {
            return form.valid;
        }
        return false;
    }

    showHelpButtonChange(checked: boolean) {
        this.showHelpButtonEvent.emit(checked);
    }

    getStepperOrientation(): StepperOrientation {
        let orientation = 'horizontal' as StepperOrientation;
        if (this.mobileQuery.matches) {
            orientation = 'vertical';
        }
        return orientation;
    }

    submitTrainingRequest() {
        this.submitted.emit();
    }
}
