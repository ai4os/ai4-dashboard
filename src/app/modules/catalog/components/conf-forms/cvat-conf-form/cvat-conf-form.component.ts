import { MediaMatcher } from '@angular/cdk/layout';
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
import { AuthService } from '@app/core/services/auth/auth.service';
import {
    CvatConfiguration,
    TrainModuleRequest,
} from '@app/shared/interfaces/module.interface';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-cvat-conf-form',
    imports: [
        UiTextFieldComponent,
        FormsModule,
        ReactiveFormsModule,

        TranslatePipe,
    ],
    templateUrl: './cvat-conf-form.component.html',
    styleUrl: './cvat-conf-form.component.scss',
})
export class CvatConfFormComponent implements OnInit {
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

    protected _defaultFormValues!: CvatConfiguration;

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: CvatConfiguration) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.cvatConfFormGroup
                .get('usernameInput')
                ?.setValue(defaultFormValues.username?.value as string);
            this.cvatConfFormGroup
                .get('passwordInput')
                ?.setValue(defaultFormValues.password?.value as string);
        }
    }

    parentForm!: FormGroup;

    cvatConfFormGroup = this.fb.group({
        usernameInput: ['', [Validators.required]],
        passwordInput: ['', [Validators.required]],
    });

    protected readonly usernameErrors = {
        required: 'CATALOG.CONF-FORMS.CVAT.USERNAME-REQUIRED',
    };
    protected readonly passwordErrors = {
        required: 'CATALOG.CONF-FORMS.CVAT.PASSWORD-REQUIRED',
    };

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;
    protected _showHelp = false;

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl('cvatConfFormGroup', this.cvatConfFormGroup);

        this.authService.userProfile$.subscribe((profile) => {
            if (profile) {
                this.cvatConfFormGroup
                    .get('usernameInput')
                    ?.setValue(profile.email);
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    getPayload(): Pick<
        TrainModuleRequest['general'],
        'cvat_username' | 'cvat_password'
    > {
        const v = this.cvatConfFormGroup.getRawValue();
        return {
            cvat_username: v.usernameInput ?? '',
            cvat_password: v.passwordInput ?? '',
        };
    }
}
