import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KafkaServerComponent } from './kafka-server.component';

describe('KafkaServerComponent', () => {
  let component: KafkaServerComponent;
  let fixture: ComponentFixture<KafkaServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KafkaServerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KafkaServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
