import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesCardComponent } from './resources-card.component';

describe('ResourcesCardComponent', () => {
  let component: ResourcesCardComponent;
  let fixture: ComponentFixture<ResourcesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourcesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
