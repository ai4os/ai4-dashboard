import {
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Ai4lifeConfiguration } from '@app/shared/interfaces/module.interface';
import { UiSelectComponent } from '@app/shared/components/ui/ui-select/ui-select.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '@app/core/services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-ai4life-conf-form',
    imports: [
        TranslatePipe,
        FormsModule,
        UiSelectComponent,
        FormsModule,
        ReactiveFormsModule,
        UiSelectComponent,
        TranslatePipe,
    ],
    templateUrl: './ai4life-conf-form.component.html',
    styleUrl: './ai4life-conf-form.component.scss',
})
export class Ai4lifeConfFormComponent implements OnInit {
    authService = inject(AuthService);
    ctrlContainer = inject(FormGroupDirective);
    fb = inject(FormBuilder);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    protected _defaultFormValues!: Ai4lifeConfiguration;

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: Ai4lifeConfiguration) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.ai4lifeConfFormGroup
                .get('modelIdSelect')
                ?.setValue(defaultFormValues.model_id?.value as string);
            defaultFormValues.model_id?.options?.forEach((type: string) => {
                this.modelIdOptions.push({
                    value: type,
                    viewValue: type,
                });
            });
        }
    }

    parentForm!: FormGroup;

    ai4lifeConfFormGroup = this.fb.group({
        modelIdSelect: ['', Validators.required],
    });

    modelIdOptions: { value: string; viewValue: string }[] = [];

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;
    protected _showHelp = false;

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'ai4lifeConfFormGroup',
            this.ai4lifeConfFormGroup
        );
    }
}
