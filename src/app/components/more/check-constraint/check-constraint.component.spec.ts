import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckConstraintComponent } from './check-constraint.component';

describe('CheckConstraintComponent', () => {
  let component: CheckConstraintComponent;
  let fixture: ComponentFixture<CheckConstraintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckConstraintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
