import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareDiagramComponent } from './share-diagram.component';

describe('ShareDiagramComponent', () => {
  let component: ShareDiagramComponent;
  let fixture: ComponentFixture<ShareDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
