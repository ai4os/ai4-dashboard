import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeListComponent } from './ai4life-list.component';

describe('Ai4lifeListComponent', () => {
  let component: Ai4lifeListComponent;
  let fixture: ComponentFixture<Ai4lifeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ai4lifeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ai4lifeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
