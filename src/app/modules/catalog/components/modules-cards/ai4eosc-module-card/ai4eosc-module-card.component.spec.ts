import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ai4eoscModuleCardComponent } from './ai4eosc-module-card.component';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { mockModuleSummaryList } from '@app/modules/catalog/services/modules-service/modules-service.mock';
import { testProviders } from '@testing/test-providers';

describe('ModuleCardComponent', () => {
    let component: Ai4eoscModuleCardComponent;
    let fixture: ComponentFixture<Ai4eoscModuleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                Ai4eoscModuleCardComponent,
                RouterModule.forRoot([]),
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(Ai4eoscModuleCardComponent);
        component = fixture.componentInstance;
        component.module = mockModuleSummaryList[0];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set isTool to false when "AI4 tools" is not present', () => {
        expect(component.isTool).toBe(false);
    });

    it('should set isTool to true when "AI4 tools" is present', () => {
        component.module.categories.push('AI4 tools');
        expect(component.isTool).toBe(true);
    });
});
