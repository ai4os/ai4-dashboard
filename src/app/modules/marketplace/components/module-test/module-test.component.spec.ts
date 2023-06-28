import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTestComponent } from './module-test.component';

describe('ModuleTestComponent', () => {
  let component: ModuleTestComponent;
  let fixture: ComponentFixture<ModuleTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
