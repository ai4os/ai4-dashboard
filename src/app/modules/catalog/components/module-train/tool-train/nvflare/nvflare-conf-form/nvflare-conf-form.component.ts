import { ChangeDetectorRef, Component, Input } from '@angular/core';
import {
    confObjectRange,
    NvflareConfiguration,
} from '@app/shared/interfaces/module.interface';
import {
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '@app/core/services/auth/auth.service';

const mockedConfObject: confObjectRange = {
    range: [],
    name: '',
    value: '',
    description: '',
};

@Component({
    selector: 'app-nvflare-conf-form',
    templateUrl: './nvflare-conf-form.component.html',
    styleUrl: './nvflare-conf-form.component.scss',
})
export class NvflareConfFormComponent {
    constructor(
        private readonly authService: AuthService,
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
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
                .get('frozenProjectSelect')
                ?.setValue(defaultFormValues.frozen_project.value as string);
            defaultFormValues.frozen_project?.options?.forEach(
                (type: string) => {
                    this.frozenProjectOptions.push({
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

            this.authService.userProfileSubject.subscribe((profile) => {
                const email = profile.email;
                this.nvflareConfFormGroup.get('usernameInput')?.setValue(email);
            });
        }
    }

    protected _defaultFormValues: NvflareConfiguration = {
        username: mockedConfObject,
        password: mockedConfObject,
        app_location: mockedConfObject,
        public_project: mockedConfObject,
        frozen_project: mockedConfObject,
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
        frozenProjectSelect: [''],
        startingDateInput: [new Date()],
        endDateInput: [new Date()],
    });

    publicProjectOptions: { value: string; viewValue: string }[] = [];
    frozenProjectOptions: { value: string; viewValue: string }[] = [];

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    protected _showHelp = false;

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'nvflareConfForm',
            this.nvflareConfFormGroup
        );
    }

    get minEndDate() {
        return this.nvflareConfFormGroup.get('startingDateInput')?.value;
    }

    get maxStartDate() {
        return this.nvflareConfFormGroup.get('endDateInput')?.value;
    }
}
