import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameDiagramComponent } from './rename-diagram.component';

describe('RenameDiagramComponent', () => {
  let component: RenameDiagramComponent;
  let fixture: ComponentFixture<RenameDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
