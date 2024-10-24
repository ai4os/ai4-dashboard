import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModuleCardComponent } from './module-card.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('ModuleCardComponent', () => {
    let component: ModuleCardComponent;
    let fixture: ComponentFixture<ModuleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModuleCardComponent],
            imports: [
                SharedModule,
                RouterModule.forRoot([]),
                TranslateModule.forRoot(),
            ],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
        }).compileComponents();

        fixture = TestBed.createComponent(ModuleCardComponent);
        component = fixture.componentInstance;
        component.module = {
            name: 'Test',
            categories: ['test'],
            tags: ['test'],
            summary: 'Testing',
            title: 'Test',
            libraries: ['test'],
            tasks: ['test'],
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
