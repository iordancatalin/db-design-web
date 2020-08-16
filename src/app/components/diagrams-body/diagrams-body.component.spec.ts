import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramsBodyComponent } from './diagrams-body.component';

describe('DiagramsBodyComponent', () => {
  let component: DiagramsBodyComponent;
  let fixture: ComponentFixture<DiagramsBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramsBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramsBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
