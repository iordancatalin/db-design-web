import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueConstraintComponent } from './unique-constraint.component';

describe('UniqueConstraintComponent', () => {
  let component: UniqueConstraintComponent;
  let fixture: ComponentFixture<UniqueConstraintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueConstraintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
