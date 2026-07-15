import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ChangeDetectionStrategy,
} from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-single-file-upload',
    templateUrl: './single-file-upload.component.html',
    styleUrl: './single-file-upload.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatFabButton, NgClass, MatIcon, TranslatePipe],
})
export class SingleFileUploadComponent implements OnInit {
    @Input() file: File | null = null;
    @Output() fileUploaded: EventEmitter<File> = new EventEmitter<File>();

    ngOnInit(): void {
        this.file = null;
    }

    onChange(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            this.file = file;
            this.fileUploaded.emit(file);
        }
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
