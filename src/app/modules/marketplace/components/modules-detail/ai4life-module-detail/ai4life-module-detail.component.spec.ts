import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeModuleDetailComponent } from './ai4life-module-detail.component';

describe('Ai4lifeModuleDetailComponent', () => {
  let component: Ai4lifeModuleDetailComponent;
  let fixture: ComponentFixture<Ai4lifeModuleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ai4lifeModuleDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ai4lifeModuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
