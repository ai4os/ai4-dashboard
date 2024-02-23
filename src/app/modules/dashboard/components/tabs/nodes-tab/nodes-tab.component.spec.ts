import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesTabComponent } from './nodes-tab.component';

describe('NodesTabComponent', () => {
  let component: NodesTabComponent;
  let fixture: ComponentFixture<NodesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodesTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
