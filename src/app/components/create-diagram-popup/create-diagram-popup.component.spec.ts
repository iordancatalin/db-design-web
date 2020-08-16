import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiagramPopupComponent } from './create-diagram-popup.component';

describe('CreateDiagramPopupComponent', () => {
  let component: CreateDiagramPopupComponent;
  let fixture: ComponentFixture<CreateDiagramPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDiagramPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDiagramPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
