import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationPopupComponent } from './relation-popup.component';

describe('RelationPopupComponent', () => {
  let component: RelationPopupComponent;
  let fixture: ComponentFixture<RelationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
