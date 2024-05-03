import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileReportComponent } from './user-profile-report.component';

describe('UserProfileReportComponent', () => {
  let component: UserProfileReportComponent;
  let fixture: ComponentFixture<UserProfileReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
