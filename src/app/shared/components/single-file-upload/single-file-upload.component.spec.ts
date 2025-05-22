import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFileUploadComponent } from './single-file-upload.component';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('SingleFileUploadComponent', () => {
    let component: SingleFileUploadComponent;
    let fixture: ComponentFixture<SingleFileUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SingleFileUploadComponent],
            imports: [TranslateModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(SingleFileUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize file as null on ngOnInit', () => {
        component.file = new File(['test'], 'test.sh');
        component.ngOnInit();
        expect(component.file).toBeNull();
    });

    it('should emit fileUploaded when a file is selected', () => {
        const mockFile = new File(['echo test'], 'script.sh', {
            type: 'application/x-sh',
        });

        jest.spyOn(component.fileUploaded, 'emit');

        const mockEvent = {
            target: {
                files: [mockFile],
            },
        };

        component.onChange(mockEvent);
        expect(component.file).toBe(mockFile);
        expect(component.fileUploaded.emit).toHaveBeenCalledWith(mockFile);
    });

    it('should not emit fileUploaded if no file is selected', () => {
        jest.spyOn(component.fileUploaded, 'emit');

        const mockEvent = {
            target: {
                files: [],
            },
        };

        component.onChange(mockEvent);
        expect(component.file).toBeNull();
        expect(component.fileUploaded.emit).not.toHaveBeenCalled();
    });

    it('should correctly format file size in KB', () => {
        const size = 500; // bytes
        expect(component.getFileSize(size)).toBe('0.49 KB');
    });

    it('should correctly format file size in MB', () => {
        const size = 2 * 1024 * 1024; // 2MB
        expect(component.getFileSize(size)).toBe('2.00 MB');
    });

    it('should open file input when button is clicked', () => {
        const fileInput = fixture.debugElement.query(
            By.css('input[type="file"]')
        ).nativeElement;
        jest.spyOn(fileInput, 'click');

        const button = fixture.debugElement.query(
            By.css('button')
        ).nativeElement;
        button.click();

        expect(fileInput.click).toHaveBeenCalled();
    });

    it('should show file name and size in template when file is set', () => {
        const mockFile = new File(['echo test'], 'script.sh');
        Object.defineProperty(mockFile, 'size', { value: 1024 });

        component.file = mockFile;
        fixture.detectChanges();

        const fileName = fixture.nativeElement.querySelector('.file-info span');
        expect(fileName.textContent).toContain('script.sh');
        const metadata = fixture.nativeElement.querySelector('.metadata');
        expect(metadata.textContent).toContain('1.00 KB');
    });
});
