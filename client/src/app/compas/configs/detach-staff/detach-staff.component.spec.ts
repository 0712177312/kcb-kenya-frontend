import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetachStaffComponent } from './detach-staff.component';

describe('DetachStaffComponent', () => {
  let component: DetachStaffComponent;
  let fixture: ComponentFixture<DetachStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetachStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetachStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
