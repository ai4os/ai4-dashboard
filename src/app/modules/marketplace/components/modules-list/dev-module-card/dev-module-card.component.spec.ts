import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevModuleCardComponent } from './dev-module-card.component';

describe('DevModuleCardComponent', () => {
  let component: DevModuleCardComponent;
  let fixture: ComponentFixture<DevModuleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevModuleCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevModuleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
