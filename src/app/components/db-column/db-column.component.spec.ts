import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbColumnComponent } from './db-column.component';

describe('DbColumnComponent', () => {
  let component: DbColumnComponent;
  let fixture: ComponentFixture<DbColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
