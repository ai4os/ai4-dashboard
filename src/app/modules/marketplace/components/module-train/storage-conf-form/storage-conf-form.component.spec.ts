import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageConfFormComponent } from './storage-conf-form.component';

describe('StorageConfFormComponent', () => {
  let component: StorageConfFormComponent;
  let fixture: ComponentFixture<StorageConfFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageConfFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageConfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
