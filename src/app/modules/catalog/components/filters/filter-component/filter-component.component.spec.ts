import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponentComponent } from './filter-component.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FilterComponentComponent', () => {
    let component: FilterComponentComponent;
    let fixture: ComponentFixture<FilterComponentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FilterComponentComponent],
            imports: [
                SharedModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                FormsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FilterComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize filteredTags from tags on init', () => {
        component.tags = new Set(['tag1', 'tag2']);
        component.ngOnInit();
        expect(component.filteredTags).toEqual(['tag1', 'tag2']);
    });

    it('should emit selected libraries on librariesChange', () => {
        const spy = jest.spyOn(component.librariesChanged, 'emit');
        component.selectedLibraries = ['lib1', 'lib2'];
        component.librariesChange();
        expect(spy).toHaveBeenCalledWith(['lib1', 'lib2']);
        expect(component.filterGroup.libraries).toEqual(['lib1', 'lib2']);
    });

    it('should emit selected tasks on tasksChange', () => {
        const spy = jest.spyOn(component.tasksChanged, 'emit');
        component.selectedTasks = ['task1'];
        component.tasksChange();
        expect(spy).toHaveBeenCalledWith(['task1']);
        expect(component.filterGroup.tasks).toEqual(['task1']);
    });

    it('should emit selected categories on categoriesChange', () => {
        const spy = jest.spyOn(component.categoriesChanged, 'emit');
        component.selectedCategories = ['cat1'];
        component.categoriesChange();
        expect(spy).toHaveBeenCalledWith(['cat1']);
        expect(component.filterGroup.categories).toEqual(['cat1']);
    });

    it('should emit selected datatypes on datatypesChange', () => {
        const spy = jest.spyOn(component.datatypesChanged, 'emit');
        component.selectedDatatypes = ['type1'];
        component.datatypesChange();
        expect(spy).toHaveBeenCalledWith(['type1']);
        expect(component.filterGroup.datatypes).toEqual(['type1']);
    });

    it('should emit selected tags and filter them on tagsChange', () => {
        const spy = jest.spyOn(component.tagsChanged, 'emit');
        component.tags = new Set([
            'deep learning',
            'audio classification',
            'general purpose',
        ]);
        component.selectedTags = ['deep learning'];
        component.searchTerm = 'audio';
        component.tagsChange();
        expect(spy).toHaveBeenCalledWith(['deep learning']);
        // should include selected + matching from search
        expect(component.filteredTags).toEqual([
            'deep learning',
            'audio classification',
        ]);
    });

    it('should emit filterGroup and reset filters on addFilter', () => {
        const spy = jest.spyOn(component.changeDetected, 'emit');
        component.filterGroup = {
            libraries: ['PyTorch'],
            tasks: ['Optimization'],
            categories: ['AI4 inference'],
            datatypes: ['image'],
            tags: ['yolov8'],
        };
        component.selectedLibraries = ['PyTorch'];
        component.selectedTasks = ['Optimization'];
        component.selectedCategories = ['AI4 inference'];
        component.selectedDatatypes = ['image'];
        component.selectedTags = ['yolov8'];

        component.addFilter();

        expect(spy).toHaveBeenCalledWith({
            libraries: ['PyTorch'],
            tasks: ['Optimization'],
            categories: ['AI4 inference'],
            datatypes: ['image'],
            tags: ['yolov8'],
        });

        // all should be reset
        expect(component.selectedLibraries).toEqual([]);
        expect(component.filterGroup.libraries).toEqual([]);
    });

    it('should filter tags based on search term', () => {
        component.tags = new Set([
            'image classification',
            'deep learning',
            'audio classification',
        ]);
        component.selectedTags = ['image classification'];
        component.searchTerm = 'classification';
        component.filterTags();
        // keeps selected and filtered, removes duplicates
        expect(component.filteredTags).toEqual([
            'image classification',
            'audio classification',
        ]);
    });
});
