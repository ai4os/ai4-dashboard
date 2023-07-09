import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTryComponent } from './module-try.component';

describe('ModuleTestComponent', () => {
  let component: ModuleTryComponent;
  let fixture: ComponentFixture<ModuleTryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleTryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
