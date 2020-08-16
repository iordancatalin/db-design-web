import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickDiagramComponent } from './pick-diagram.component';

describe('PickDiagramComponent', () => {
  let component: PickDiagramComponent;
  let fixture: ComponentFixture<PickDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
