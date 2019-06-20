import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetachCustomerComponent } from './detach-customer.component';

describe('DetachCustomerComponent', () => {
  let component: DetachCustomerComponent;
  let fixture: ComponentFixture<DetachCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetachCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetachCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
