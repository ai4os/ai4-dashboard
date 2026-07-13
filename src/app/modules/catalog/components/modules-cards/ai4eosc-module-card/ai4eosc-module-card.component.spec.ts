import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ai4eoscModuleCardComponent } from './ai4eosc-module-card.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { mockModuleSummaryList } from '@app/modules/catalog/services/modules-service/modules-service.mock';
import { COMMON_TEST_PROVIDERS } from '@testing/test-providers';

describe('ModuleCardComponent', () => {
    let component: Ai4eoscModuleCardComponent;
    let fixture: ComponentFixture<Ai4eoscModuleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Ai4eoscModuleCardComponent],
            imports: [
                SharedModule,
                RouterModule.forRoot([]),
                TranslatePipe,
                TranslateDirective,
            ],
            providers: [...COMMON_TEST_PROVIDERS],
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
        component.ngOnInit();
        expect(component.isTool).toBe(true);
    });
});
