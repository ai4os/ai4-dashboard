import {
    ChangeDetectorRef,
    Component,
    Input,
    ChangeDetectionStrategy,
    OnInit,
    inject,
} from '@angular/core';
import {
    ConfObjectRange,
    NvflareConfiguration,
} from '@app/shared/interfaces/module.interface';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '@app/core/services/auth/auth.service';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import { UiSelectComponent } from '@app/shared/components/ui/ui-select/ui-select.component';
import { UiDatePickerComponent } from '@app/shared/components/ui/ui-date-picker/ui-date-picker.component';

const mockedConfObject: ConfObjectRange = {
    range: [],
    name: '',
    value: '',
    description: '',
};

@Component({
    selector: 'app-nvflare-conf-form',
    templateUrl: './nvflare-conf-form.component.html',
    styleUrl: './nvflare-conf-form.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        TranslatePipe,
        UiTextFieldComponent,
        UiSelectComponent,
        UiDatePickerComponent,
    ],
})
export class NvflareConfFormComponent implements OnInit {
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

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(defaultFormValues: NvflareConfiguration) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.nvflareConfFormGroup
                .get('passwordInput')
                ?.setValue(defaultFormValues.password.value as string);
            this.nvflareConfFormGroup
                .get('appLocationInput')
                ?.setValue(defaultFormValues.app_location.value as string);
            this.nvflareConfFormGroup
                .get('publicProjectSelect')
                ?.setValue(defaultFormValues.public_project.value as string);
            defaultFormValues.public_project?.options?.forEach(
                (type: string) => {
                    this.publicProjectOptions.push({
                        value: type,
                        viewValue: type,
                    });
                }
            );
            this.nvflareConfFormGroup
                .get('startingDateInput')
                ?.setValue(defaultFormValues.starting_date.value as Date);
            this.nvflareConfFormGroup
                .get('endDateInput')
                ?.setValue(defaultFormValues.end_date.value as Date);

            this.authService.userProfile$.subscribe((profile) => {
                if (profile) {
                    const email = profile.email;
                    this.nvflareConfFormGroup
                        .get('usernameInput')
                        ?.setValue(email);
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }

    protected readonly usernameErrors = {
        required: 'CATALOG.CONF-FORMS.NVFLARE.USERNAME-REQUIRED',
    };
    protected readonly passwordErrors = {
        required: 'CATALOG.CONF-FORMS.NVFLARE.PASSWORD-REQUIRED',
    };

    protected _defaultFormValues: NvflareConfiguration = {
        username: mockedConfObject,
        password: mockedConfObject,
        app_location: mockedConfObject,
        public_project: mockedConfObject,
        starting_date: mockedConfObject,
        end_date: mockedConfObject,
    };

    parentForm!: FormGroup;

    hidePassword = true;

    nvflareConfFormGroup = this.fb.group({
        usernameInput: ['', Validators.required],
        passwordInput: ['', Validators.required],
        appLocationInput: [''],
        publicProjectSelect: [''],
        startingDateInput: [new Date()],
        endDateInput: [new Date()],
    });

    publicProjectOptions: { value: string; viewValue: string }[] = [];

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;
    protected _showHelp = false;

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'nvflareConfForm',
            this.nvflareConfFormGroup
        );
    }

    get minEndDate() {
        return (
            this.nvflareConfFormGroup.get('startingDateInput')?.value ?? null
        );
    }

    get maxStartDate() {
        return this.nvflareConfFormGroup.get('endDateInput')?.value ?? null;
    }
}
