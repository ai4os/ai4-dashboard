import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTrainViewComponent } from './module-train-view.component';

describe('ModuleTrainViewComponent', () => {
    let component: ModuleTrainViewComponent;
    let fixture: ComponentFixture<ModuleTrainViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModuleTrainViewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ModuleTrainViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
