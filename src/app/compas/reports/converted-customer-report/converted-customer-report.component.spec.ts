import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertedCustomerReportComponent } from './converted-customer-report.component';

describe('ConvertedCustomerReportComponent', () => {
  let component: ConvertedCustomerReportComponent;
  let fixture: ComponentFixture<ConvertedCustomerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertedCustomerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertedCustomerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
