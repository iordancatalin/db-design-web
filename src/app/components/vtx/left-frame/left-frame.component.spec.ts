import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftFrameComponent } from './left-frame.component';

describe('LeftFrameComponent', () => {
  let component: LeftFrameComponent;
  let fixture: ComponentFixture<LeftFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
