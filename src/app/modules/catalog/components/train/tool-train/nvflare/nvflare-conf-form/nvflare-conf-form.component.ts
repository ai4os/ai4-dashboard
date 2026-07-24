import {
    ChangeDetectorRef,
    Component,
    Input,
    ChangeDetectionStrategy,
    OnInit,
    inject,
} from '@angular/core';
import {
    confObjectRange,
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
import {
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatSuffix,
    MatError,
} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatOption } from '@angular/material/select';
import {
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
} from '@angular/material/datepicker';
import { TranslatePipe } from '@ngx-translate/core';

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
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        MatFormField,
        MatLabel,
        MatInput,
        MatHint,
        MatIcon,
        MatSuffix,
        MatError,
        MatSelect,
        MatOption,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatDatepicker,
        TranslatePipe,
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
