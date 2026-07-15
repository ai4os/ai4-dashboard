import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesTabComponent } from './nodes-tab.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { expect } from '@jest/globals';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testProviders } from '@testing/test-providers';

describe('NodesTabComponent', () => {
    let component: NodesTabComponent;
    let fixture: ComponentFixture<NodesTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NodesTabComponent, TranslatePipe, TranslateDirective],
            providers: [...testProviders],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(NodesTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show titles and accordions', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        let title = compiled.querySelector('#nodes-cpu-title')?.textContent;
        expect(title).toContain('NODES-CPU');
        expect(compiled.querySelector('#cpu-accordion')).toBeTruthy();
        const statsContainer =
            compiled.querySelector('#nodes-cpu-title')?.textContent;
        expect(statsContainer).toBeTruthy();

        title = compiled.querySelector('#nodes-gpu-title')?.textContent;
        expect(title).toContain('NODES-GPU');
        expect(compiled.querySelector('#gpu-accordion')).toBeTruthy();
    });
});
