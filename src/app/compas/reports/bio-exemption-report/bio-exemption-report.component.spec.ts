import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BioExemptionReportComponent } from './bio-exemption-report.component';

describe('BioExemptionReportComponent', () => {
  let component: BioExemptionReportComponent;
  let fixture: ComponentFixture<BioExemptionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BioExemptionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BioExemptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
