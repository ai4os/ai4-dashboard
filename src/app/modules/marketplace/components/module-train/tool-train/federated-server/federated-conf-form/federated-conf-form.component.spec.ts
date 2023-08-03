import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FederatedConfFormComponent } from './federated-conf-form.component';

describe('FederatedConfFormComponent', () => {
  let component: FederatedConfFormComponent;
  let fixture: ComponentFixture<FederatedConfFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FederatedConfFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FederatedConfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
