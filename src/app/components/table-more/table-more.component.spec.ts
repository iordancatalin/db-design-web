import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMoreComponent } from './table-more.component';

describe('TableMoreComponent', () => {
  let component: TableMoreComponent;
  let fixture: ComponentFixture<TableMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
