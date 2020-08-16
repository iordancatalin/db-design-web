import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramOptionsComponent } from './diagram-options.component';

describe('DiagramOptionsComponent', () => {
  let component: DiagramOptionsComponent;
  let fixture: ComponentFixture<DiagramOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
