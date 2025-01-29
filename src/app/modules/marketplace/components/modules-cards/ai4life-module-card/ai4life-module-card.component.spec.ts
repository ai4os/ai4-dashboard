import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeModuleCardComponent } from './ai4life-module-card.component';
import { TranslateModule } from '@ngx-translate/core';

describe('Ai4lifeModuleCardComponent', () => {
    let component: Ai4lifeModuleCardComponent;
    let fixture: ComponentFixture<Ai4lifeModuleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4lifeModuleCardComponent],
            imports: [TranslateModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4lifeModuleCardComponent);
        component = fixture.componentInstance;
        component.module = {
            id: '',
            name: '',
            description: '',
            doi: '',
            created: '',
            covers: [],
            downloadCount: '',
            tags: [],
            license: '',
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
