import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    inject,
    signal,
    Input,
} from '@angular/core';
import {
    FormControl,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { SingleFileUploadComponent } from '@app/shared/components/single-file-upload/single-file-upload.component';
import { TextEditorComponent } from '@app/shared/components/text-editor/text-editor.component';
import { CopyToClipboardDirective } from '@app/shared/directives/copy-to-clipboard.directive';
import {
    UiTabsComponent,
    Tab,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { TranslatePipe } from '@ngx-translate/core';

type BatchInputMode = 'upload' | 'write';

@Component({
    selector: 'app-batch-conf-form',
    templateUrl: './batch-conf-form.component.html',
    styleUrls: ['./batch-conf-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SingleFileUploadComponent,
        TextEditorComponent,
        CopyToClipboardDirective,
        UiTabsComponent,
        UiButtonComponent,
        TranslatePipe,
    ],
})
export class BatchConfFormComponent implements OnInit {
    private readonly ctrlContainer = inject(FormGroupDirective);
    private readonly fb = inject(FormBuilder);
    private readonly snackbarService = inject(SnackbarService);

    protected _showHelp = false;
    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    parentForm!: FormGroup;

    batchConfFormGroup = this.fb.group({
        batchFile: new FormControl<File | null>(null, Validators.required),
    });

    protected readonly tabs: Tab[] = [
        {
            id: 'upload',
            label: 'CATALOG.CONF-FORMS.BATCH.UPLOAD-FILE',
        },
        {
            id: 'write',
            label: 'CATALOG.CONF-FORMS.BATCH.COMMANDS',
        },
    ];

    protected activeMode = signal<BatchInputMode>('upload');

    initialCommandText = '';
    commandText = '';
    textManuallyModified = false;
    textEditorPlaceholder =
        'python /src/my-app/my-app/train.py --epochs 10 \ncp -r /src/my-app/models /storage/my-new-modelsweights \n...';

    protected readonly docsUrl =
        'https://docs.ai4os.eu/en/latest/howtos/train/batch.html#configuring-a-batch-job';

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl('batchConfForm', this.batchConfFormGroup);
    }

    onModeSelected(mode: string): void {
        this.activeMode.set(mode as BatchInputMode);
        this.clearFileData();
    }

    updateBatchFile(file: File): void {
        this.batchConfFormGroup.get('batchFile')?.setValue(file);
    }

    getBatchFile(): File {
        return this.batchConfFormGroup.getRawValue().batchFile!;
    }

    clearFileData(): void {
        this.batchConfFormGroup.get('batchFile')?.setValue(null);
        this.textManuallyModified = false;
    }

    onCommandTextChange(newValue: string): void {
        this.commandText = newValue;
        this.textManuallyModified =
            this.commandText.trim() !== this.initialCommandText.trim();
    }

    createFileFromText(): void {
        const content = this.commandText.trim();
        this.initialCommandText = content;
        const blob = new Blob([content], { type: 'text/x-shellscript' });
        const file = new File([blob], 'script-from-text.sh', {
            type: 'text/x-shellscript',
        });
        this.updateBatchFile(file);
        this.snackbarService.openSuccess(
            'Batch command file generated successfully!'
        );
        this.textManuallyModified = false;
    }
}
