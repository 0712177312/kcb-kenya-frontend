import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertStaffToCustomerComponent } from './convert-staff-to-customer.component';

describe('ConvertStaffToCustomerComponent', () => {
  let component: ConvertStaffToCustomerComponent;
  let fixture: ComponentFixture<ConvertStaffToCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertStaffToCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertStaffToCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
