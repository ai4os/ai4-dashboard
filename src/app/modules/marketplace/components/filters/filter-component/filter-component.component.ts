import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-filter-component',
    templateUrl: './filter-component.component.html',
    styleUrls: ['./filter-component.component.scss'],
})
export class FilterComponentComponent {
    @Input() libraries: Set<string> = new Set<string>();
    selectedLibraries: string[] = [];
    @Output() onLibrariesChanged = new EventEmitter<string[]>();

    @Input() tasks: Set<string> = new Set<string>();
    selectedTasks: string[] = [];
    @Output() onTasksChanged = new EventEmitter<string[]>();

    @Input() categories: Set<string> = new Set<string>();
    selectedCategories: string[] = [];
    @Output() onCategoriesChanged = new EventEmitter<string[]>();

    @Input() datatypes: Set<string> = new Set<string>();
    selectedDatatypes: string[] = [];
    @Output() onDatatypesChanged = new EventEmitter<string[]>();

    librariesChange() {
        this.onLibrariesChanged.emit(this.selectedLibraries);
    }

    tasksChange() {
        this.onTasksChanged.emit(this.selectedTasks);
    }

    categoriesChange() {
        this.onCategoriesChanged.emit(this.selectedCategories);
    }

    datatypesChange() {
        this.onDatatypesChanged.emit(this.selectedDatatypes);
    }
}
