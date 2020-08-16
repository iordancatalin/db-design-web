import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadStorageComponent } from './load-storage.component';

describe('LoadStorageComponent', () => {
  let component: LoadStorageComponent;
  let fixture: ComponentFixture<LoadStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
