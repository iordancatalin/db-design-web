import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightFrameComponent } from './right-frame.component';

describe('RightFrameComponent', () => {
  let component: RightFrameComponent;
  let fixture: ComponentFixture<RightFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
