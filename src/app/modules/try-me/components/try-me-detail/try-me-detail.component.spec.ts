import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TryMeDetailComponent } from './try-me-detail.component';

describe('TryMeDetailComponent', () => {
  let component: TryMeDetailComponent;
  let fixture: ComponentFixture<TryMeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TryMeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TryMeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
