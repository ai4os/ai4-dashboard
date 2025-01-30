import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ai4eoscModuleCardComponent } from './ai4eosc-module-card.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('ModuleCardComponent', () => {
    let component: Ai4eoscModuleCardComponent;
    let fixture: ComponentFixture<Ai4eoscModuleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4eoscModuleCardComponent],
            imports: [
                SharedModule,
                RouterModule.forRoot([]),
                TranslateModule.forRoot(),
            ],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4eoscModuleCardComponent);
        component = fixture.componentInstance;
        component.module = {
            name: 'Test',
            categories: ['test'],
            tags: ['test'],
            summary: 'Testing',
            title: 'Test',
            libraries: ['test'],
            tasks: ['test'],
            id: 'test',
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
