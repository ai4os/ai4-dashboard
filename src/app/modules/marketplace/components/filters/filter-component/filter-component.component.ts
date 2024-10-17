import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterGroup } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-filter-component',
    templateUrl: './filter-component.component.html',
    styleUrls: ['./filter-component.component.scss'],
})
export class FilterComponentComponent implements OnInit {
    @Input() libraries: Set<string> = new Set<string>();
    @Input() tasks: Set<string> = new Set<string>();
    @Input() categories: Set<string> = new Set<string>();
    @Input() datatypes: Set<string> = new Set<string>();
    @Input() tags: Set<string> = new Set<string>();

    @Output() librariesChanged = new EventEmitter<string[]>();
    @Output() tasksChanged = new EventEmitter<string[]>();
    @Output() categoriesChanged = new EventEmitter<string[]>();
    @Output() datatypesChanged = new EventEmitter<string[]>();
    @Output() tagsChanged = new EventEmitter<string[]>();
    @Output() changeDetected = new EventEmitter<FilterGroup>();

    selectedLibraries: string[] = [];
    selectedTasks: string[] = [];
    selectedCategories: string[] = [];
    selectedDatatypes: string[] = [];
    selectedTags: string[] = [];
    filteredTags: string[] = [];
    searchTerm = '';

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
        this.librariesChanged.emit(this.selectedLibraries);
        this.filterGroup.libraries = this.selectedLibraries;
    }

    tasksChange() {
        this.tasksChanged.emit(this.selectedTasks);
        this.filterGroup.tasks = this.selectedTasks;
    }

    categoriesChange() {
        this.categoriesChanged.emit(this.selectedCategories);
        this.filterGroup.categories = this.selectedCategories;
    }

    datatypesChange() {
        this.datatypesChanged.emit(this.selectedDatatypes);
        this.filterGroup.datatypes = this.selectedDatatypes;
    }

    tagsChange() {
        this.filterTags();
        this.tagsChanged.emit(this.selectedTags);
        this.filterGroup.tags = this.selectedTags;
    }

    filterTags() {
        const selected = this.selectedTags || [];
        const tagsArray = Array.from(this.tags);

        if (!this.searchTerm) {
            this.filteredTags = tagsArray;
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredTags = tagsArray.filter((tag) =>
                tag.toLowerCase().includes(searchLower)
            );
        }

        this.filteredTags = [...selected, ...this.filteredTags].filter(
            (value, index, self) => self.indexOf(value) === index
        );

        this.filteredTags.sort((a, b) => {
            return tagsArray.indexOf(a) - tagsArray.indexOf(b);
        });
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
