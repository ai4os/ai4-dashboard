import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TryMeListComponent } from './try-me-list.component';

describe('TryMeListComponent', () => {
  let component: TryMeListComponent;
  let fixture: ComponentFixture<TryMeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TryMeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TryMeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
