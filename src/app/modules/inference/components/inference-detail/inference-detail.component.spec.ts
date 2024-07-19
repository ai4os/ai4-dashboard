import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InferenceDetailComponent } from './inference-detail.component';

describe('InferenceDetailComponent', () => {
  let component: InferenceDetailComponent;
  let fixture: ComponentFixture<InferenceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InferenceDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InferenceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
