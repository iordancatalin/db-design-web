import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbuilderComponent } from './dbuilder.component';

describe('DbuilderComponent', () => {
  let component: DbuilderComponent;
  let fixture: ComponentFixture<DbuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
