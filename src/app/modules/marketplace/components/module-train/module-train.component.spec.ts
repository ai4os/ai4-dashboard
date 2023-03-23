import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTrainComponent } from './module-train.component';

describe('ModuleTrainComponent', () => {
  let component: ModuleTrainComponent;
  let fixture: ComponentFixture<ModuleTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTrainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
