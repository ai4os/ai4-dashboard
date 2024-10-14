import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterGroup } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-filter-component',
    templateUrl: './filter-component.component.html',
    styleUrls: ['./filter-component.component.scss'],
})
export class FilterComponentComponent implements OnInit {
    constructor() {}

    @Input() libraries: Set<string> = new Set<string>();
    @Input() tasks: Set<string> = new Set<string>();
    @Input() categories: Set<string> = new Set<string>();
    @Input() datatypes: Set<string> = new Set<string>();
    @Input() tags: Set<string> = new Set<string>();

    @Output() onLibrariesChanged = new EventEmitter<string[]>();
    @Output() onTasksChanged = new EventEmitter<string[]>();
    @Output() onCategoriesChanged = new EventEmitter<string[]>();
    @Output() onDatatypesChanged = new EventEmitter<string[]>();
    @Output() onTagsChanged = new EventEmitter<string[]>();
    @Output() onChange = new EventEmitter<FilterGroup>();

    selectedLibraries: string[] = [];
    selectedTasks: string[] = [];
    selectedCategories: string[] = [];
    selectedDatatypes: string[] = [];
    selectedTags: string[] = [];
    filteredTags: string[] = [];
    searchTerm: string = '';

    filterGroup: FilterGroup = {
        libraries: [],
        tasks: [],
        categories: [],
        datatypes: [],
        tags: [],
    };

    ngOnInit() {
        this.filteredTags = Array.from(this.tags);
    }

    librariesChange() {
        this.onLibrariesChanged.emit(this.selectedLibraries);
        this.filterGroup.libraries = this.selectedLibraries;
    }

    tasksChange() {
        this.onTasksChanged.emit(this.selectedTasks);
        this.filterGroup.tasks = this.selectedTasks;
    }

    categoriesChange() {
        this.onCategoriesChanged.emit(this.selectedCategories);
        this.filterGroup.categories = this.selectedCategories;
    }

    datatypesChange() {
        this.onDatatypesChanged.emit(this.selectedDatatypes);
        this.filterGroup.datatypes = this.selectedDatatypes;
    }

    tagsChange() {
        this.filterTags();
        this.onTagsChanged.emit(this.selectedTags);
        this.filterGroup.tags = this.selectedTags;
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

    addFilter() {
        this.onChange.emit(this.filterGroup);
        this.resetFilters();
    }

    resetFilters() {
        this.filterGroup = {
            libraries: [],
            tasks: [],
            categories: [],
            datatypes: [],
            tags: [],
        };
        this.selectedLibraries = [];
        this.selectedTasks = [];
        this.selectedCategories = [];
        this.selectedDatatypes = [];
        this.selectedTags = [];
        this.onChange.emit();
    }
}
