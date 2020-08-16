import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramsHeaderComponent } from './diagrams-header.component';

describe('DiagramsHeaderComponent', () => {
  let component: DiagramsHeaderComponent;
  let fixture: ComponentFixture<DiagramsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
