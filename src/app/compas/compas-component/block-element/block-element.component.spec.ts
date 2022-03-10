import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockElementComponent } from './block-element.component';

describe('BlockElementComponent', () => {
  let component: BlockElementComponent;
  let fixture: ComponentFixture<BlockElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
