import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ChangeDetectionStrategy,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { UiButtonComponent } from '../ui/ui-button/ui-button.component';

@Component({
    selector: 'app-single-file-upload',
    templateUrl: './single-file-upload.component.html',
    styleUrl: './single-file-upload.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon, TranslatePipe, UiButtonComponent],
})
export class SingleFileUploadComponent {
    @Input() file: File | null = null;
    @Input() showReplaceAction = true;
    @Output() fileUploaded: EventEmitter<File> = new EventEmitter<File>();
    @Output() fileRemoved: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('fileUpload')
    private readonly fileInputRef!: ElementRef<HTMLInputElement>;

    onChange(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            this.file = file;
            this.fileUploaded.emit(file);
        }
    }

    removeFile(event: MouseEvent): void {
        event.stopPropagation();
        this.file = null;
        if (this.fileInputRef) {
            this.fileInputRef.nativeElement.value = '';
        }
        this.fileRemoved.emit();
    }

    getFileSize(sizeInBytes: number): string {
        const sizeInKB = sizeInBytes / 1024;
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB < 1) {
            return sizeInKB.toFixed(2) + ' KB';
        } else {
            return sizeInMB.toFixed(2) + ' MB';
        }
    }
}
