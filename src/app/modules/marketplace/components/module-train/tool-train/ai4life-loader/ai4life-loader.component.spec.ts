import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ai4lifeLoaderComponent } from './ai4life-loader.component';

describe('Ai4lifeLoaderComponent', () => {
  let component: Ai4lifeLoaderComponent;
  let fixture: ComponentFixture<Ai4lifeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ai4lifeLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ai4lifeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
