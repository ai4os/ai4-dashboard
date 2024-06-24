import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetsListComponent } from './datasets-list.component';

describe('DatasetsListComponent', () => {
  let component: DatasetsListComponent;
  let fixture: ComponentFixture<DatasetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
