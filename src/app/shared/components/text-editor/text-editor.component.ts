import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { EditorState } from '@codemirror/state';
import {
    EditorView,
    highlightActiveLineGutter,
    keymap,
    lineNumbers,
} from '@codemirror/view';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import {
    bracketMatching,
    defaultHighlightStyle,
    syntaxHighlighting,
    indentOnInput,
    StreamLanguage,
} from '@codemirror/language';
import { history, historyKeymap, defaultKeymap } from '@codemirror/commands';
import { highlightSelectionMatches } from '@codemirror/search';
import { closeBracketsKeymap } from '@codemirror/autocomplete';
import { basicSetup } from 'codemirror';

@Component({
    selector: 'app-text-editor',
    templateUrl: './text-editor.component.html',
    styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements AfterViewInit {
    @Input() value: string = '';
    @Input() readonly: boolean = false;
    @Input() disabled: boolean = false;
    @Input() height: string = '200px';

    @Output() textChange = new EventEmitter<string>();

    @ViewChild('editorContainer', { static: true })
        editorContainer!: ElementRef;

    private editorView!: EditorView;

    ngAfterViewInit(): void {
        this.initEditor();
        this.editorContainer.nativeElement.style.setProperty(
            '--editor-height',
            this.height
        );
    }

    private initEditor(): void {
        if (!this.editorContainer?.nativeElement) {
            console.warn('Editor container not found');
            return;
        }

        const updateListener = EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                const text = update.state.doc.toString();
                this.value = text;
                this.textChange.emit(text);
            }
        });

        this.editorView = new EditorView({
            state: EditorState.create({
                doc: this.value,
                extensions: [
                    updateListener,
                    EditorView.editable.of(!this.readonly && !this.disabled),
                    StreamLanguage.define(shell),
                    basicSetup,
                ],
            }),
            parent: this.editorContainer.nativeElement,
        });
    }
}
