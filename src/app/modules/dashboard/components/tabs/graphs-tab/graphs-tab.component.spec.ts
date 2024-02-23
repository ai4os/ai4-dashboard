import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphsTabComponent } from './graphs-tab.component';

describe('GraphsTabComponent', () => {
  let component: GraphsTabComponent;
  let fixture: ComponentFixture<GraphsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphsTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
