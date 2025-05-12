import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-single-file-upload',
    templateUrl: './single-file-upload.component.html',
    styleUrl: './single-file-upload.component.scss',
})
export class SingleFileUploadComponent {
    constructor() {}

    file: File | null = null;

    @Output() fileUploaded: EventEmitter<File> = new EventEmitter<File>();

    onChange(event: any) {
        const file: File = event.target.files[0];

        if (file) {
            this.file = file;
            this.fileUploaded.emit(file);
        }
    }
}
