import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { FilterGroup } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-filter-component',
    templateUrl: './filter-component.component.html',
    styleUrls: ['./filter-component.component.scss'],
})
export class FilterComponentComponent implements OnInit {
    constructor(private appConfigService: AppConfigService) {}

    @Input() libraries: Set<string> = new Set<string>();
    selectedLibraries: string[] = [];

    @Input() tasks: Set<string> = new Set<string>();
    selectedTasks: string[] = [];

    @Input() categories: Set<string> = new Set<string>();
    selectedCategories: string[] = [];

    @Input() datatypes: Set<string> = new Set<string>();
    selectedDatatypes: string[] = [];

    @Input()
    tags: Set<string> = new Set<string>();
    selectedTags: string[] = [];
    filteredTags: string[] = [];
    searchTerm: string = '';

    @Output() onChange = new EventEmitter<FilterGroup>();

    filterGroup: FilterGroup = {
        libraries: [],
        tasks: [],
        categories: [],
        datatypes: [],
        tags: [],
    };

    ngOnInit() {
        if (this.appConfigService.voName === 'vo.imagine-ai.eu') {
            this.filterGroup.datatypes.push('Image');
            this.filterGroup.tags.push('vo.imagine-ai.eu');
            this.filterGroup.tags.push('general purpose');
            this.filterTags();
            this.addFilter();
        }

        this.filteredTags = Array.from(this.tags);
    }

    librariesChange() {
        this.filterGroup.libraries = this.selectedLibraries;
    }

    tasksChange() {
        this.filterGroup.tasks = this.selectedTasks;
    }

    categoriesChange() {
        this.filterGroup.categories = this.selectedCategories;
    }

    datatypesChange() {
        this.filterGroup.datatypes = this.selectedDatatypes;
    }

    tagsChange() {
        this.filterTags();
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
    }
}
