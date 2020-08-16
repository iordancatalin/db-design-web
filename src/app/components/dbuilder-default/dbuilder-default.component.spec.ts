import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbuilderDefaultComponent } from './dbuilder-default.component';

describe('DbuilderDefaultComponent', () => {
  let component: DbuilderDefaultComponent;
  let fixture: ComponentFixture<DbuilderDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbuilderDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbuilderDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
