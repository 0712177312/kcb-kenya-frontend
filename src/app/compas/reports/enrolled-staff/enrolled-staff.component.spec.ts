import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledStaffComponent } from './enrolled-staff.component';

describe('EnrolledStaffComponent', () => {
  let component: EnrolledStaffComponent;
  let fixture: ComponentFixture<EnrolledStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolledStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolledStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
