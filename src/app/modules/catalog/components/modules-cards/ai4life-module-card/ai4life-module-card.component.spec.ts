import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeModuleCardComponent } from './ai4life-module-card.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { mockAi4lifeModules } from '@app/modules/catalog/services/modules-service/modules-service.mock';
import { testProviders } from '@testing/test-providers';

describe('Ai4lifeModuleCardComponent', () => {
    let component: Ai4lifeModuleCardComponent;
    let fixture: ComponentFixture<Ai4lifeModuleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                Ai4lifeModuleCardComponent,
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4lifeModuleCardComponent);
        component = fixture.componentInstance;
        component.module = mockAi4lifeModules[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
