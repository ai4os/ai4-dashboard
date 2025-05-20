import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorComponent } from './text-editor.component';
import { ElementRef } from '@angular/core';

describe('TextEditorComponent', () => {
    let component: TextEditorComponent;
    let fixture: ComponentFixture<TextEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TextEditorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TextEditorComponent);
        component = fixture.componentInstance;

        // Mock codemirror editor container
        const div = document.createElement('div');
        component.editorContainer = new ElementRef(div);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set editor height style on init', () => {
        const container = component.editorContainer.nativeElement;
        const expectedHeight = '300px';
        component.height = expectedHeight;
        component.ngAfterViewInit();

        expect(container.style.getPropertyValue('--editor-height')).toBe(
            expectedHeight
        );
    });

    it('should emit textChange when text is changed', () => {
        jest.spyOn(component.textChange, 'emit');

        const newValue = 'new shell script content';

        fixture.detectChanges();

        // Mock text change
        component.editorView.dispatch({
            changes: {
                from: 0,
                to: component.editorView.state.doc.length,
                insert: newValue,
            },
        });

        expect(component.textChange.emit).toHaveBeenCalledWith(newValue);
    });
});
