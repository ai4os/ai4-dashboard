import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleCardComponent } from './module-card.component';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ModuleCardComponent', () => {
    let component: ModuleCardComponent;
    let fixture: ComponentFixture<ModuleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModuleCardComponent],
            imports: [SharedModule, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ModuleCardComponent);
        component = fixture.componentInstance;
        component.module = {
            name: 'Test',
            keywords: ['test'],
            summary: 'Testing',
            title: 'Test',
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
