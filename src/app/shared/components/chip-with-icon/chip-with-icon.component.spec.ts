import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipWithIconComponent } from './chip-with-icon.component';

describe('ChipWithIconComponent', () => {
  let component: ChipWithIconComponent;
  let fixture: ComponentFixture<ChipWithIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChipWithIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipWithIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
