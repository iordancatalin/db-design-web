import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramToolsComponent } from './diagram-tools.component';

describe('DiagramToolsComponent', () => {
  let component: DiagramToolsComponent;
  let fixture: ComponentFixture<DiagramToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
