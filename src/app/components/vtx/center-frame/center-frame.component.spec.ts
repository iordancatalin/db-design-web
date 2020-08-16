import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterFrameComponent } from './center-frame.component';
import { expect } from '@angular/platform-browser/testing/src/matchers';
import { describe } from '@angular/core/testing/src/testing_internal';

describe('CenterFrameComponent', () => {
  let component: CenterFrameComponent;
  let fixture: ComponentFixture<CenterFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
