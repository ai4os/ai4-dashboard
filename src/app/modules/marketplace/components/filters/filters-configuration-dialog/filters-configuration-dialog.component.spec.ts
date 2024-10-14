import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersConfigurationDialogComponent } from './filters-configuration-dialog.component';

describe('FiltersConfigurationDialogComponent', () => {
  let component: FiltersConfigurationDialogComponent;
  let fixture: ComponentFixture<FiltersConfigurationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersConfigurationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersConfigurationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
