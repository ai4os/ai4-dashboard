import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretManagementDetailComponent } from './secret-management-detail.component';

describe('SecretManagementDetailComponent', () => {
  let component: SecretManagementDetailComponent;
  let fixture: ComponentFixture<SecretManagementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretManagementDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
