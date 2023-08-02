import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsTableComponent } from './tools-table.component';

describe('ToolsTableComponent', () => {
    let component: ToolsTableComponent;
    let fixture: ComponentFixture<ToolsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ToolsTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ToolsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
