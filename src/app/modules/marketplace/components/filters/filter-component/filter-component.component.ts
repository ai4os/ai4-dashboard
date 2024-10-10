import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-filter-component',
    templateUrl: './filter-component.component.html',
    styleUrls: ['./filter-component.component.scss'],
})
export class FilterComponentComponent implements OnInit {
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

    @Input()
    tags: Set<string> = new Set<string>();
    selectedTags: string[] = [];
    filteredTags: string[] = [];
    searchTerm: string = '';
    @Output() onTagsChanged = new EventEmitter<string[]>();

    ngOnInit() {
        this.filteredTags = Array.from(this.tags);
    }

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

    tagsChange() {
        this.filterTags();
        this.onTagsChanged.emit(this.selectedTags);
    }

    filterTags() {
        const selected = this.selectedTags || [];

        if (!this.searchTerm) {
            this.filteredTags = Array.from(this.tags);
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredTags = Array.from(this.tags).filter((fruit) =>
                fruit.toLowerCase().includes(searchLower)
            );
        }

        this.filteredTags = [...selected, ...this.filteredTags].filter(
            (value, index, self) => self.indexOf(value) === index
        );
    }
}
