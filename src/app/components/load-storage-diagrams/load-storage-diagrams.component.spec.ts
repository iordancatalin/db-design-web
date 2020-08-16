import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadStorageDiagramsComponent } from './load-storage-diagrams.component';

describe('LoadStorageDiagramsComponent', () => {
  let component: LoadStorageDiagramsComponent;
  let fixture: ComponentFixture<LoadStorageDiagramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadStorageDiagramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadStorageDiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
